const express = require('express');
const jsonBodyParser = express.json()
const LanguageService = require('./language-service');
const { requireAuth } = require('../middleware/jwt-auth');
const { display } = require('../utils/LinkedList');

const languageRouter = express.Router()

languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )

      if (!language)
        return res.status(404).json({
          error: `You don't have any languages`,
        })

      req.language = language
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )

      res.json({
        language: req.language,
        words,
      })
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/head', async (req, res, next) => {
    try {
      const nextWord = await LanguageService.getNextWord(
        req.app.get('db'),
        req.language.head
      )
      res.status(200).json({
        totalScore: req.language.total_score,
        ...nextWord
      })
      next();
    } catch(error){
      next(error)
    }
  })

languageRouter
  .use(requireAuth)
  .route('/guess')
  .post(jsonBodyParser, async (req, res, next) => {
    const { guess } = req.body;
    if(!guess) {
      return res.status(400).send({ error: "Missing 'guess' in request body" })
    }
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'), req.language.id
      )
      let list = await LanguageService.createLinkedList(words, req.language)
        
      const head = list.head;
      let { translation } = head.value;
      let correct = false;
      if(guess === translation) {
        correct = true;
        head.value.memory_value *= 2
        head.value.correct_count++
        req.language.total_score++
      }
      else {
        head.value.incorrect_count++
        head.value.memory_value = 1
      }
      // let oldHead = head.value
      // let oldMem = head.value.memory_value
      list.remove(head.value);
      // console.log('HEAD------->', head)
      list.insertAt(head.value, head.value.memory_value + 1);
      // console.log('NEWLIST', JSON.stringify(list, null, 4))
      let langFieldsToUpdate = {
        head: list.head.value.id,
        totalScore: req.language.total_score,
        langId: req.language.id,
      }
      let wordFieldsToUpdate = {
        wordId: head.value.id,
        memoryValue: head.value.memory_value,
        correctCount: head.value.correct_count,
        incorrectCount: head.value.incorrect_count,
        next: head.next
      }
      // console.log('HEADD', head.value)
      // console.log('NEED TO UPDATE -->', wordFieldsToUpdate)
      await LanguageService.updateLanguage(req.app.get('db'), langFieldsToUpdate)
      await LanguageService.updateWord(req.app.get('db'), wordFieldsToUpdate)
      // console.log('UPDATEDDDDDDD', wordFieldsToUpdate)
      const nextWord = list.head.value
      res.send(
        {
          isCorrect: correct,
          nextWord: nextWord.original,
          totalScore: req.language.total_score,
          wordCorrectCount: nextWord.correct_count,
          wordIncorrectCount: nextWord.incorrect_count,
          answer: translation
        }
      )
    }
    catch(error) {
      next(error);
    }
  });

module.exports = languageRouter

