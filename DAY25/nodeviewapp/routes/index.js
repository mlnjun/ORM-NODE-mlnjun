var express = require('express');
var router = express.Router();

/* 
기능 : 관리자 웹사이트 메인페이지 요청과 응답처리 라우팅 메소드
호출 주소 : http://localhost:3000/
*/
router.get('/', async(req, res, next)=>{
  res.render('index',);
});


/* 
기능 : 관리자 웹사이트 로그인 웹페이지 요청과 응답처리 라우팅 메소드
호출 주소 : http://localhost:3000/
*/
router.get('/login', async(req, res, next)=>{
  res.render('login',);
});





module.exports = router;
