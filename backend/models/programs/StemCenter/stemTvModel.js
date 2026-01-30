const {DataTypes} =require('sequelize');
const sequelize =require('../../../config/db');

const StemTv =sequelize.define('StemTv',{
    title:{
        type:DataTypes.STRING(200),
        allowNull:false
    },
    desctiption:{
        type:DataTypes.TEXT,
        allowNull:true,
    },
    youtube_url:{
        type:DataTypes.STRING(500),
        allowNull:false,
        validate:{
            isUrl:true
        }
    },
    youtube_id:{
        type:DataTypes.STRING(50),
        allowNull:true,
        comment:'Extracted YouTube video id'
    },
    published_at:{
        type:DataTypes.DATE,
        defaultValue:DataTypes.NOW
    }
    
},{
    tableName:'stem_tv',
    timestamps:true
});

module.exports =StemTv;