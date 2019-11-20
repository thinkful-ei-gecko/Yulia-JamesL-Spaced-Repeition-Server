const { LinkedList } = require('../utils/LinkedList');

const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score',
      )
      .where('language.user_id', user_id)
      .first();
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count',
      )
      .orderBy('next', 'ascending')
      .where({ language_id });
  },

  createLinkedList(arr, language) {
    let list = new LinkedList();
    let curr = arr.find(word => word.id === language.head);

    list.insertLast(curr);

    while(curr.next !== null) {
      curr = arr.find(word => word.id === curr.next);
      list.insertLast(curr);
    }
    return list;
  },

  getNextWord(db, head) {
    return db
    //find word that is the head from word db and return vals to pass test
      .from('word')
      .select('original', 'correct_count', 'incorrect_count')
      .where('word.id', head) //adds head col that ref word.id
      .then(word => {
        return {
          nextWord: word[0].original,
          wordCorrectCount: word[0].correct_count,
          wordIncorrectCount: word[0].incorrect_count
        };
      });
  },

  updateLanguage(db, fields) {
    return db.transaction(trx => {
      return trx('language')
      .where({id: fields.langId})
      .update({
        total_score: fields.totalScore,
        head: fields.head
      })
    })
  },

  updateWord(db, fields) {
    return db.transaction(trx => {
      return trx('word')
        .where({id: fields.wordId})
        .update({
          memory_value: fields.memoryValue,
          correct_count: fields.correctCount,
          incorrect_count: fields.incorrectCount,
          next: fields.next
        })
    })
  },

  insertWord(db, words, language_id, total_score) {
    return db 
      .transaction(async trx => {
        return Promise
          .all([trx('language')
            .where({id: language_id})
              .update({total_score, head: words[0].id}),
              ...words.map((word, index) => {
                // console.log('WORDS', word)
                // console.log('INDEX', index)
                if(index+1 >= words.length) {
                  word.next = null;
                }
                else {
                  word.next = words[index + 1].id;
                }
                return trx('word').where({id: word.id}).update({...word})
              })
            ])

      })
  },
}

module.exports = LanguageService
