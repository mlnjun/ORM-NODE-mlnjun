var express = require('express');
var router = express.Router();

var db = require('../models/index');

var bcrypt = require('bcryptjs');
var AES = require('mysql-aes');

// jsonwebtoken 패키지 참조하기
const jwt = require('jsonwebtoken');

// 사용자 토큰제공여부 체크 미들웨어 참조하기
var {tokenAuthChecking} = require('./apiMiddleware');

// 각종 열거형 상수 참조하기-코드성 데이터
var constants = require('../common/enum');


/**
- 신규회원 가입처리 RESTful API 라우팅 메소드
-http://localhost:3000/api/member/entry
 */
router.post('/entry', async(req, res, next) => {
  var apiResult = {
    code:400,
    data:null,
    msg:""
  };

  try{
    var email = req.body.email;
    var password = req.body.password;
    var name = req.body.name;
    var telephone = req.body.telephone;


    // 회원가입 로직 추가 : 메일주소 중복체크
    var existMember = await db.Member.findOne({ where: { email } });


    if(existMember != null){

      apiResult.code = 500;
      apiResult.data = null;
      apiResult.msg = "ExistDoubleEmail";

    }else{
      
      // 단방향 암호화 해시 알고리즘 적용 사용자 암호 암호화 적용
      var encryptedPassword = await bcrypt.hash(password, 12);

      // 양방향 암호화
      var encryptedTelephone = AES.encrypt(telephone, process.env.MYSQL_AES_KEY);

      var member = {
        email,
        member_password:encryptedPassword,
        name,
        profile_img_path:"",
        telephone:encryptedTelephone,
        entry_type_code:0,
        use_state_code:1,
        reg_date:Date.now(),
        reg_member_id:0
      }
      
      
      var registedMember = await db.Member.create(member);

      // 불필요한 중요 데이터 속성값은 지우고 프론트엔드에 전달
      registedMember.member_password = ""; 
      registedMember.telephone = AES.decrypt(registedMember.telephone, process.env.MYSQL_AES_KEY);

      apiResult.code = 200;
      apiResult.data = registedMember;
      apiResult.msg = "Ok";
    }



  }catch(err){
    console.log('서버에러발생-/api/member/entry',err.message);

    apiResult.code = 500;
    apiResult.data = null;
    apiResult.msg = "Failed";
  }


  res.json(apiResult);
});


/**
- 회원 로그인 처리 RESTful API 라우팅 메소드
-http://localhost:3000/api/member/login
 */
router.post('/login', async(req, res, next) => {
  var apiResult = {
      code:400,
      data:null,
      msg:""
  };

  try{
    var email = req.body.email;
    var password = req.body.password;

    var resultMsg = "";
    
    // step1 : 로그인(인증)-동일 메일주소 여부 체크
    var member = await db.Member.findOne({ where:{ email:email } });
    

    if(member == null){
      resultMsg = "NotExistEmail";

      apiResult.code = 400;  // 서버에 없는 자원 요청 오류코드
      apiResult.data = null;
      apiResult.msg = resultMsg;
  
    }else{
      // step2: 단방향 암호화 기반 동일암호 일치여부 체크
      // 단방향 암호화 해시 알고리즘 암호 체크
      var compareResult = await bcrypt.compare(password, member.member_password);

      
      if(compareResult){
        resultMsg = "Ok";
        
        member.member_password = "";
        member.telephone = AES.decrypt(member.telephone, process.env.MYSQL_AES_KEY);

        // step3 : 인증된 사용자의 기본정보 JWT토큰 생성 발급
        // step3.1 : JWT토큰에 담을 사용자 정보 생성
        //JWT인증 사용자 정보 토큰 값 구조 정의 및 데이터 세팅
        var memberTokenData = {
          member_id:member.member_id,  // 구분되는 고유한 PK가 핵심
          email:member.email,
          name:member.name,
          profile_img_path:member.profile_img_path,
          telephone:member.telephone,
          etc:"기타정보"
        }

        var token = await jwt.sign(memberTokenData, process.env.JWT_SECRET, {expiresIn:'24h', issuer:'company'});

        apiResult.code = 200;
        apiResult.data = token;
        apiResult.msg = resultMsg;
      }else{
        resultMsg = "NotCorrectPassword";

        apiResult.code = 500;
        apiResult.data = null;
        apiResult.msg = resultMsg;
      }
    }


  }catch(err){
    console.log('서버에러발생-/api/member/entry',err.message);

    apiResult.code = 500;
    apiResult.data = null;
    apiResult.msg = "Failed";
  }


  res.json(apiResult);
});


/**
- 회원 암호 찾기 RESTful API 라우팅 메소드
-http://localhost:3000/api/member/find
 */
router.post('/find', async(req, res, next) => {
  res.json({});
});


/*
HTTP를 통해 데이터를 전달하는 경우
HEADER : QUERTIMG. KEY, 기타정보, HEADER.AUTHRIZATION=JWT토큰
BODY : POST를 통해 JSON데이터
*/
/*
-로그인한 현재 사용자의 회원 기본정보 조회 API
-http://localhost:3000/api/member/profile\
-로그인시 발급한 JWT토큰은 HTTP Header영역에 포함되어 전달한다.
*/
router.get('/profile', tokenAuthChecking, async(req,res,next)=>{

  var apiResult = {
    code:400,
    data:null,
    msg:""
  };


  try{
    // step1 : 웹브라우저 헤더에서 사용자 JWT Bearer 인증토큰 값을 추출한다.
    // req.header.authorization = "Bearer FEHELJBDJSBFAAAFSK"
    var token = req.headers.authorization.split('Bearer ')[1];
    var tokenJsonData = await jwt.verify(token, process.env.JWT_SECRET);
    
    var loginMemberId = tokenJsonData.member_id;
    var loginMemberEmail = tokenJsonData.email;

    var dbMember = await db.Member.findOne({
      where:{ member_id:loginMemberId },
      attributes: ['email','name','profile_img_path','telephone', 'birth_date']
    });

    dbMember.telephone = AES.decrypt(dbMember.telephone, process.env.MYSQL_AES_KEY);

    apiResult.code = 200;
    apiResult.data = dbMember;
    apiResult.msg = "Ok";

  }catch(err){
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.msg = "Failed";
  }


  res.json(apiResult);
});


/*
-전체회원 목록 조회 API
-http://localhost:3000/api/member/userall
-로그인시 발급한 JWT토큰은 HTTP Header영역에 포함되어 전달한다.
*/
router.get('/all', tokenAuthChecking, async(req,res,next)=>{
  var apiResult = {
    code:400,
    data:null,
    msg:""
  };


  try{

    var members = await db.Member.findAll({
      attributes:['member_id','email','name','profile_img_path','telephone'],
      where:{use_state_code:constants.USE_STATE_CODE_USED}
  });

    apiResult.code = 200;
    apiResult.data = members;
    apiResult.msg = "Ok";
  }catch(err){
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.msg = "Failed";
  }


  res.json(apiResult);
});



module.exports = router;
