import {Router} from "express";
import multer from 'multer'
import mongoose from "mongoose";
import Grid from "gridfs-stream";

import { storage } from "../config";
import { mongoURI } from "../config/keys";

Grid.mongo = mongoose.mongo
let gfs

mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useCreateIndex: true
})
  .then(conn => {
    gfs = Grid(conn.db)
    gfs.collection('uploads')
  })

const router = Router();

router.route('/').get((req, res) => {
  gfs.files.find().toArray((err, files) => {
    if(!files || files.length === 0){
      res.render('index', {files: false})
    }else{
      files.map(file => {
        if(file.contentType === 'image/jpeg' || file.contentType === 'image/png'){
          file.isImage = true
        }else{
          file.isImage = false
        }
      })
      res.render('index', {files})
    }
  })
})

router.route('/upload').post(multer({storage}).single('file'), (req, res) => {
  res.redirect('/')
})

router.route('/files').get((req, res) => {
  gfs.files.find().toArray((err, files) => {
    if(!files || files.length === 0){
      return res.status(404).json({
        err: 'No files exists'
      })
    }

    return res.json(files)
  })
})

router.route('/files/:filename').get((req, res) => {
  gfs.files.findOne({filename: req.params.filename}, (err, file) => {
    if(!file){
      return res.status(404).json({
        err: 'No file exists'
      })
    }
    return res.json(file)
  })
})

router.route('/image/:filename').get((req, res) => {
  gfs.files.findOne({filename: req.params.filename}, (err, file) => {
    if(!file){
      return res.status(404).json({
        err: 'No file exists'
      })
    }
    if(file.contentType === 'image/jpeg' || file.contentType === 'image/png'){
      const readstream = gfs.createReadStream(file.filename)
      readstream.pipe(res)
    }else{
      res.status(404).json({
        err: 'No an image'
      })
    }
  })
})

router.route('/files/:id').delete((req, res) => {
  gfs.remove({_id: req.params.id, root: 'uploads'}, (err, gridFSBucket) => {
    if(err){
      return res.status(404).json(err)
    }
    res.redirect('/')
  })
})

export default router