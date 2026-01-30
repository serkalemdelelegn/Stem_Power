const cloudinary =require('cloudinary').v2;

cloudinary.config({
    cloud_name:"dzcd8yymv",
    api_key:"819282357397797",
    api_secret:"oHaiqZyCnBJjIXnIhBXd41LgvcY",
    secure:true

});

module.exports =cloudinary;