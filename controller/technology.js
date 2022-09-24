const Technology = require('../model/technologies');

const addTech = async (req, res) => {
    try {
        const technology = await Technology.create(req.body);
        return res.status(200).json({
            result: true,
            msg: 'Technology added Successfully',
            Technology: technology
        });
    } catch (error) {
        console.log('Error in creating technology', error);
        return res.status(200).json({
            result: false,
            msg: 'Error in creating Technology'
        })
    }
}

module.exports = {
    addTech
}