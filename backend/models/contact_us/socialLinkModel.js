const {DataTypes} =require('sequelize');
const sequelize =require('../../config/db');

const SocialLink = sequelize.define('SocialLink',{
    platform:{
        type:DataTypes.STRING(150),
        allowNull:false 

    },
    url:{
        type:DataTypes.STRING(500),
        allowNull:false,
        validate:{isUrl:true}
    },
    icon:{
        type:DataTypes.STRING(500),
        allowNull:false
    }
},{
    tableName:'social_links',
    timestamps:true
});


module.exports = SocialLink;