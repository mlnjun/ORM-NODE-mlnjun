var express = require('express');
var router = express.Router();

// 관리자 사이트 관리자 계정 정보관리 라우팅 기능 제공


/*
-목록 페이지 호출
호출 주소 : http://localhost:3001/admin/list
GET
*/
router.get('/list',function(req,res){
  // admin 계정 정보 객체 리스트
  var admin_member = [
    {
      admin_id:"asd123",
      admin_password:"asd123",
      admin_name:'A'
    },
    {
      admin_id:"qwe456",
      admin_password:"qwe456",
      admin_name:'B'
    },
    {
      admin_id:"zxc123",
      admin_password:"zxc123",
      admin_name:'C'
    }
  ]

  res.render('admin/list',{admin_member});
});


/*
-관리자 계정 생성페이지 호출
호출주소 : http://localhost:3001/admin/create
GET
*/
router.get('/create', function(req,res){
  res.render('admin/create');
});


/*
-관리자 계정 생성페이지 계정생성 정보 요청과 응답
호출주소 : http://localhost:3001/admin/create
POST
*/
router.post('/create', function(req,res){
  var admin_id = req.body.aid;
  var admin_password = req.body.apassword;
  var admin_name = req.body.aname;

  var admin_member = [
    {
      admin_id,
      admin_password,
      admin_name
    }
  ]

  
  res.redirect('/admin/list');
});


/*
-관리자 계정 수정 페이지 호출
호출주소 : http://localhost:3001/admin/modify/A
GET
*/
router.get('/modify/:aid', function(req,res){
  var admin_id = req.params.aid;

  // admin id 데이터로 DB정보 찾기


  // 임시 데이터
  var admin_member = {
    admin_id:"asd123",
    admin_password:"asd123",
    admin_name:'A'
  };

  res.render('admin/modify', {admin_member});
});


/*
-관리자 계정 수정 페이지 수정 데이터 요청과 응답
호출주소 : http://localhost:3001/admin/modify
POST
*/
router.post('/modify/:aid', function(req,res){
  var admin_id = req.body.aid;
  var admin_password = req.body.apassword;
  var admin_name = req.body.aname;

  var admin_member = [
    {
      admin_id,
      admin_password,
      admin_name
    }
  ]

  res.redirect('/admin/list');
});


/*
-관리자 계정 데이터 삭제 요청과 응답
호출주소 : http://localhost:3001/admin/delete
GET
*/
router.get('/delete', function(req,res){
  var admin_id = req.body.aid;
  // Id 정보로 DB에서 데이터 찾은 후 제거

  res.redirect('/admin/list');
});






module.exports = router;
