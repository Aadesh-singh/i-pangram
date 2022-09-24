const Project = require('../model/projectModel');
const UserData = require('../model/users');
const checkAuth = require('../lib/validator');
const moment = require('moment');
const nodemailer = require('nodemailer');

// nodemailer transporter
const transporter = nodemailer.createTransport({
    // host: 'mail.privateemail.com',
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'thecodiaorg@gmail.com',  
      pass: '***'     
    },
  });




const addProject = async (req, res) => {
    try {
        let verifyToken = await checkAuth.verifyToken(req);
        if(!verifyToken){
            return res.status(200).json({
                result: true,
                msg: "Unauthorized Attemt / Token expired"
            });
        }
        console.log('User: ', verifyToken);
        let user = await UserData.findOne({_id: verifyToken.userId});
        if(user.userType != 'mentor'){
            return res.status(200).json({
                result: true,
                msg: "You need to be mentor to do this operation"
            });
        }
        var link;
        console.log('req.files', req.files);
        console.log('req.file', req.file);
        console.log('req.body', req.body);
        // Project.uploadDocument(req, res, function(err){
        //     // console.log('req: ', req);
        //     if(err){
        //         console.log('multer error', err);
        //     }
        //     console.log('file: ', req.file);
        // link = Project.DocumentPath + '/' + req.file.filename
        // });
        link = '/upload' + '/' + req.files.documents[0].filename;
        console.log(link);
        let tempArr = new Array();
        tempArr.push(link);
        console.log('ddddddddddd: ',moment(req.body.start).toISOString());
        const data = {
            requirements: {
                text: req.body.requirements,
                time: Date.now()
            },
            start: new Date(req.body.start),
            // start: req.body.start,
            end: new Date(req.body.end),
            // end: req.body.end,
            documents: tempArr,
            members: [user._id],
            tech: req.body.tech
        }
        let project = await Project.create(data);

        return res.status(200).json({
            result: true,
            msg: "Project Created Successfully",
            project: project
        });


    } catch (err) {
        console.log('Error in creating Project', err);
        return res.status(200).json({
            result: false,
            msg: 'Error in creating Projects',
        });
    }
}

const addMember = async (req, res) => {
    try {
        let verifyToken = await checkAuth.verifyToken(req);
        if(!verifyToken){
            return res.status(200).json({
                result: true,
                msg: "Unauthorized Attemt / Token expired"
            });
        }
        console.log('User: ', verifyToken);
        let user = await UserData.findOne({_id: verifyToken.userId});
        if(user.userType != 'mentor'){
            return res.status(200).json({
                result: true,
                msg: "You need to be mentor to do this operation"
            });
        }
        console.log(req.body); //projectId
        const project = await Project.findOne({_id: req.body.id});
        req.body.memberToAdd.forEach(itm => project.members.push(itm));
        project.save();

        let project1 = await Project.findOne({_id: req.body.id}).populate({
            path: 'members',
            polulate: {
                path: 'members'
            }
        });
        console.log(project1);
        project1.members.forEach(mem => {
            const options = {
                from: 'thebillionstour@gmail.com',
                to: mem.email,
                subject: 'Welcome Onboard',
                text: 'sample text',
                html: `<div style="margin:5%">
                                <div style="width: 100%;">
                                <div style="background: #0A5783;width: 100%;border-radius: 50px;min-height:400px">
                                <div style="width: 100%;">
                                <div style="width: 18%;padding: 8px;">
                                    <div style="font-size: 17px> You are selected for challenge </div>
                                </div>
                                ${project1.requirements.text}
                                ${project1.requirements.time}
                                ${project1.start}
                                ${project1.end}
                                ${project1.documents[0]}
                                ${project1.tech}
                                </div>
                                </div>
                                </div>`
              };
              transporter.sendMail(options, function (error, info) {
                if (error) {
                  console.log(error);
                }
                else {
                  console.log('Email sent: ' + info.response);
                }
              });
        })

        


        return res.status(200).json({
            result: true,
            msg: "Member added successfully",
            project: project
        });


    } catch (err) {
        console.log('Error in adding member', err);
        return res.status(200).json({
            msg: 'Error in adding memebers',
            result: false,
        });
    }
}

const removeMember = async (req, res) => {
    try {
        let verifyToken = await checkAuth.verifyToken(req);
        if(!verifyToken){
            return res.status(200).json({
                result: true,
                msg: "Unauthorized Attemt / Token expired"
            });
        }
        console.log('User: ', verifyToken);
        let user = await UserData.findOne({_id: verifyToken.userId});
        if(user.userType != 'mentor'){
            return res.status(200).json({
                result: true,
                msg: "You need to be mentor to do this operation"
            });
        }

        console.log(req.body);
        const project = await Project.findOne({_id: req.body.id});
        project.members = project.members.filter( ( el ) => !req.body.toRemove.find(rm => (el.toString() === rm.toString())));
        console.log(project.members);
        project.save();
        return res.status(200).json({
            result: true,
            msg: "Removed Successfully",
            project: project
        });
        

    } catch (err) {
        console.log('error in removing user', err);
        return res.status(200).json({
            result: false,
            msg: "Error in removing users"
        })
    }
}

const displayProjects = async (req, res) => {
    try {
        let verifyToken = await checkAuth.verifyToken(req);
        if(!verifyToken){
            return res.status(200).json({
                result: true,
                msg: "Unauthorized Attemt / Token expired"
            });
        }

        console.log('User: ', verifyToken);
        let skip = req.body.pageNo;
        let limit = req.body.limit;

        let user = await UserData.findOne({_id: verifyToken.userId});
        // pagination
        const projects = await Project.find({members: {$in: [user._id]}}).skip(skip).limit(limit);
        console.log(projects);


        return res.status(200).json({
            result: true,
            msg: "Projects",
            projects: projects
        });
    } catch (err) {
        console.log('Error in displaying projects');
        return res.status(200).json({
            msg: 'Error in displaying Projects',
            result: false
        });
    }
}

const individualProject = async (req, res) => {
    try {
        const project = await Project.findOne({_id: req.body.query});
        return res.status(200).json({
            result: true,
            msg: "Individial project",
            project: project
        });
    } catch (err) {
        console.log('Error in display' ,err);
        return res.status(200).json({
            result: true,
            msg: 'Error in display'
        })
    }
}

module.exports = {
    addProject,
    addMember,
    removeMember,
    displayProjects,
    individualProject
}