var express = require("express");
var router = express.Router();

var db = require("../models/index");

var bcrypt = require('bcryptjs');
const session = require("express-session");
const passport = require("passport");

const {isloggedIn, isNotloggedIn} = require('./passportAuthMiddleware');

/*
-메인 페이지 요청 라우팅 메소드
-호출 주소 : http://localhost:3001
*/
router.get("/",isloggedIn, function (req, res, next) {
  // 로그인정보 쿠키 유무 확인
  // if(req.session.loginAdmin == undefined){
  //   res.redirect('/login');
  // }else{
  //   var sessionData = req.session.loginAdmin;
  //   res.render("index", {admin_member:sessionData} );
  // }

  var sessionData = req.session.passport.user;
  res.render("index", {admin_member:sessionData} );
});


/*
-로그인 페이지 요청 라우팅 메소드
-호출 주소 : http://localhost:3001/login
*/
router.get('/login', async(req,res)=>{
  res.render('login', { layout: false, resultMsg:"" , loginError:req.flash('loginError')});
});


/*
-로그인 페이지 요청과 응답 라우팅 메소드
-호출 주소 : http://localhost:3001/login
*/
router.post("/login", async (req, res) => {
  var admin_id = req.body.admin_id;
  var admin_password = req.body.admin_password;

  // DB에서 해당 id 정보 찾기
  var admin_member = await db.Admin.findOne({ where: { admin_id: admin_id } });

  let resultMsg = "";

  if (admin_member == null) {
    // 아이디 틀림
    resultMsg = "해당 아이디가 존재하지 않습니다.";
  } else {
    // 비밀번호 컴페어
    var compaeredPW = await bcrypt.compare(admin_password, admin_member.admin_password);


    if (compaeredPW) {  // 비밀번호 동일 시 진행
      // session에 저장할 데이터 객체
      let adminSessionData = {
        admin_member_id:admin_member.admin_member_id,
        admin_id:admin_member.admin_id,
        admin_name:admin_member.admin_name,
        company_code:admin_member.company_code,
        dept_name:admin_member.dept_name
      };

      // 세션에 보낼 데이터 지정
      req.session.loginAdmin = adminSessionData;

      // 세션에 데이터 보내기 + 콜백함수
      req.session.save(function(){
        // 로그인 성공
        res.redirect("/");
      })
    } else {
      // 비밀번호 틀림
      resultMsg = "해당 아이디의 비밀번호가 아닙니다.";
    }
  }

  if (resultMsg !== "") {
    res.render("login", { layout: false, resultMsg, admin_id, admin_password });
  }
});


router.post("/passportlogin", async (req,res,next)=>{

  passport.authenticate('local', (authError, user, info) => {
    if(authError){
      // 에러 콘솔에 찍고 app.js에 authError 정보 보내기
      console.error(authError);
      return next(authError);
    }

    if(!user){
      // 세션 데이터가 없을 때(ID, PW 틀림) > 로그인 실패
      req.flash('loginError',info.message);  // 페이지가 redirect메소드에 웹페이지에 데이터 전달
      return res.redirect('/login');
    }

    // 정상 로그인
    // return req.login(세션 데이터, (에러값)=>{
    return req.login(user, (loginError)=>{
      if(loginError){
        console.error(loginError);
        return next(loginError);
      }

      // 로그인 성공 메인페이지 이동
      return res.redirect('/');
    })
  })(req,res,next);
});


// 로그아웃 라우팅 메소드
// http://localhost:3001/logout
router.get('/logout', (req,res,next)=>{
  req.logout(function(err){
    if(err){
      return next(err);
    }

    req.session.destroy();
    res.redirect('/login');
  })
});




module.exports = router;
