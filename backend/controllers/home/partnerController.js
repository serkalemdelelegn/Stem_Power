const Partner =require("../../models/home/partnerModel");

exports.createPartner =async(req,res)=>{
    try {
        const logoUrl=req.file?req.file.path:null;
        if(!logoUrl){
            return res.status(404).json({message:"Logo is required"});
        }
        const partner =await Partner.create({
            name:req.body.name,
            logo_url:logoUrl,
            website_url:req.body.website_url || null,
            is_active:req.body.is_active??true,
        });
        res.status(200).json(partner);
    } catch (error) {
        res.status(500).json({message:"Error creating Partner",error:error.message});
    }

};

//Get all partner

exports.getPartners = async(req,res)=>{
    try {
        const partners = await Partner.findAll();
        res.status(200).json(partners);
    } catch (error) {
        res.status(500).json({message:'Error fetching partners',error:error.message});
    }
};

//Get partner by id

exports.getPartnerById= async(req,res)=>{
    try {
        const partner =await Partner.findByPk(req.params.id);
        if(!partner) return res.status(404).json({message:'Partner not found'});
        res.status(200).json({partner});
    } catch (error) {
        res.status(500).json({message:'Error fetching partner',error:error.message});
    }
};

//update partner

exports.updatePartner =async(req,res)=>{
    try {
        const partner =await Partner.findByPk(req.params.id);
        if(!partner) return res.status(404).json({message:'partner not found'});
       const logoUrl=req.file?req.file.path:partner.logo_url;
       await partner.update({
        name:req.body.name ?? partner.name,
        logo_url:logoUrl,
        website_url:req.body.website_url??partner.website_url,
        is_active:req.body.is_active??partner.is_active
       });
       res.status(200).json({partner})
    } catch (error) {
        res.status(500).json({message:'Error updating Partner'});
    }
};

exports.deletePartner=async(req,res)=>{
    try {
        const partner =await Partner.findByPk(req.params.id);
        if(!partner)return res.status(404).json({message:'Partner not found'});
        await partner.destroy();
        res.status(200).json({message:'Partner deleted successfully'})
    } catch (error) {
        res.status(500).json({message:'Error deleting Partner',error:error.message});
    }
};