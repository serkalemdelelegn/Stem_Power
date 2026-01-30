const {DataTypes}=require('sequelize');
const sequelize =require('../../config/db');

const NewsLetterSubscriber=sequelize.define('NewsLetterSubscriber',{
    first_name:{
        type:DataTypes.STRING(100),
        allowNull:false
    },
    last_name:{
        type:DataTypes.STRING(100),
        allowNull:false
    },
    email:{
        type:DataTypes.STRING(150),
        allowNull:false,
        unique:true,
        validate:{isEmail:true}
    },
    subscribed_at:{
        type:DataTypes.DATE,
        defaultValue:DataTypes.NOW
    }
    
},{
    tableName:'newsletter_subscriber',
    timestamps:true
});

module.exports =NewsLetterSubscriber;