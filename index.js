

const express = require('express');
require("dotenv").config();

const redis = require('redis')
const { createAdapter } = require("@socket.io/redis-adapter");
const app = express()
const http = require("http");
const {Server} = require('socket.io')
const cors = require('cors');
const quizRouter = require("./api/quizz/quizz.router")
const questionRouter = require("./api/question/question.router")
const gameRouter = require("./api/game/game.router")
const answerRouter = require("./api/answer/answer.router")
const resultRecordRouter = require("./api/resultRecord/resultRecord.router");
const playerRouter = require("./api/player/player.router");
const userRouter = require("./api/user/user.router")
const mediaRouter = require("./api/media/media.router")
const mediaQuestionRouter = require("./api/questionMedia/questionMedia.router")

const path = require('path');


const multer = require('multer')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null,uniqueSuffix + "-"+ file.originalname)
  }
});

const upload = multer({ storage, limits: { fieldSize: 25 * 1024 * 1024 } });



const gameService = require('./api/game/game.service');


const REDIS_PORT = 6379;


app.use(cors());

app.post('/api/upload',upload.single('file'),(req,res)=> {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  // Respond with the full filename including the uniqueSuffix
  res.json({
    originalName: req.file.originalname, // Original name of the uploaded file
    storedName: req.file.filename,      // File name with uniqueSuffix
    path: `/uploads/${req.file.filename}` // Path to access the file
  });
})

app.use('/api/upload', express.static(path.join(__dirname, 'uploads')))

const server = http.createServer(app)


// Create Redis client
// const redisClient = new redis.createClient(REDIS_PORT);
const redisClient = new redis.createClient({url: process.env.REDIS_URL});


const fs = require('fs');
const util = require('util');

// Create a writable stream for the log file
const log_file = fs.createWriteStream(__dirname + '/debug.log', { flags: 'w' });
const log_stdout = process.stdout;

// ANSI color codes for colored output
const reset = "\x1b[0m";
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  blue: "\x1b[34m",
  yellow: "\x1b[33m",
  white: "\x1b[37m",
};

// Helper function to log with colors
const logWithColor = (color, level, message) => {
  const formattedMessage = `${color}${level}: ${message}${reset}`;
  log_file.write(`${level}: ${message}\n`); // Write uncolored message to log file
  log_stdout.write(formattedMessage + '\n'); // Write colored message to terminal
};

// Override console.log for standard logging
console.log = (message, ...args) => {
  const formattedMessage = util.format(message, ...args);
  logWithColor(colors.white, 'LOG', formattedMessage);
};

// Override console.error for error logging
console.error = (message, ...args) => {
  const formattedMessage = util.format(message, ...args);
  logWithColor(colors.red, 'ERROR', formattedMessage);
};

// Custom log methods for specific log levels
const log = {
  green: (message) => logWithColor(colors.green, 'SUCCESS', message),
  red: (message) => logWithColor(colors.red, 'ERROR', message),
  blue: (message) => logWithColor(colors.blue, 'INFO', message),
  yellow: (message) => logWithColor(colors.yellow, 'WARNING', message),
};

// Connect to Redis
(async () => {
  
  await redisClient.connect();
})();


redisClient.on('connect', () => log.green('Connected to Redis'));
redisClient.on('error', (err) => log.red('Redis Client Error', err));

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  }
});


io.on('connection', (socket) => {
  log.blue('A user connected',socket.id);

  socket.on("message",(message)=> {
    socket.emit('message',message)
  })

  socket.on('create_room',async(data)=> {
    const room_id = String(data.room_id)
    const quizz_id = String(data.quizz_id)
    try {
      const exists = await redisClient.EXISTS(`room:${room_id}`)
      const operator = await redisClient.get(`operator:room:${room_id}`)
      if (operator) {
        console.log(`only 1 operator are allowed in room`)
        socket.emit('already_operated','only 1 operator are allowed in room')
        return
      }
      if (exists) {
        console.log(`room ${room_id} already exist, instead joining room ${room_id}`)
        socket.join(room_id)
        return
      }

      await redisClient.hSet(`room:${room_id}`, {current_question:'0', quizz_id:quizz_id})

      await redisClient.expire(`room:${room_id}`, 3600);

      await redisClient.set(`operator:id:${socket.id}`, room_id)
      await redisClient.set(`operator:room:${room_id}`, socket.id)



      socket.join(room_id)

      log.blue(`${room_id} are created`)
    }catch(error) {
      log.red('error creating room:',error)
    }
  })

  socket.on('start_game',async(data)=> {

    const {room_id} = data
    try{
      const existsRoom = await redisClient.EXISTS(`room:${room_id}`)
      if (!existsRoom) {
        console.log(`${room_id} Room doesnt exists or created yet`)
        return
      }
      //get speisicif current time dd/mm/yy time
      const currentTime = new Date().toISOString();

      await redisClient.hSet(`room:${room_id}`, 'started_at', currentTime)

      const playerIds = await redisClient.sMembers(`room:${room_id}:players`);
      const totalPlayers = playerIds.length;  
      log.blue(`room ${room_id} total player is ${totalPlayers}`)
      socket.to(room_id).emit('game_started',totalPlayers)
    }catch(error) {
      log.red(error)
    }
  })

  socket.on('times_up',async(data)=> {
    const {room_id} = data
    socket.to(room_id).emit('times_out','times up')
  })

  socket.on('end_game', async(data)=> {
    const {room_id} = data

    try{
      const existsRoom = await redisClient.EXISTS(`room:${room_id}`)
      if (!existsRoom) {
        log.red(`${room_id} Room doesnt exists or created yet`)
        return
      }
      
      const currentTime = new Date().toISOString();
      //geting data from redis

         
      await redisClient.hSet(`room:${room_id}`, 'ended_at',currentTime)

      socket.to(room_id).emit('game_ended',"game is ended!!")


      const started_at = await redisClient.hGet(`room:${room_id}`, 'started_at')

      log.red(`${room_id} was started at ${started_at}`)

      
      //store data in db

          // Fetch all question IDs for the room
          const questionIds = await redisClient.sMembers(`room:${room_id}:questions`);
      
          // Initialize resultData to store all question results
          const resultData = [];
      
          // Loop through each question ID and process answers
          for (const question_id of questionIds) {
            const answerCounts = await redisClient.hGetAll(`answers:${room_id}:${question_id}`);
      
           // Prepare the answers array for the current question
          const answers = await Promise.all(
            Object.entries(answerCounts).map(async ([user_id, data]) => {
              const { point, answer_id } = JSON.parse(data);

              // Fetch additional data from Redis
              const playerData = await redisClient.hGetAll(`player:${user_id}`);
              const { username, avatar_id } = playerData;

              return { user_id, username, avatar_id, answer_id, point }; // Add processed answer data
            })
          );
                
            // Add processed question data to resultData
            resultData.push({ question_id, answers });
          }
      
          // Store game result in the database
          await new Promise((resolve, reject) => {
            gameService.updateGame(
              {
                started_at: new Date(started_at),
                ended_at: new Date(currentTime),
                result: JSON.stringify(resultData),
                game_pin: room_id,
              },
              (error, result) => {
                if (error) {
                  console.error('Error updating game:', error);
                  return reject(error);
                }
                resolve(result);
              }
            );
          });
      

    //end store data in db


    }catch(error) {
      log.red(error)
    }
    
  })

  socket.on('join_room', async(data)=> {
    //room_id, user_id, username, avatar_id
    const room_id = data.room_id
    const user_id = data.user_id
    const username = data.username
    const avatar_id = data.avatar_id
    try {
        const existsRoom = await redisClient.EXISTS(`room:${room_id}`)

        if (!existsRoom) {
          console.log(`${room_id} Room doesnt exists or created yet`)
          socket.emit('room_not_found', 'Room doesnt exists or created yet');
          return
        }

        const alreadyInTheRoom = await redisClient.EXISTS(`player:${user_id}`)

        if (alreadyInTheRoom) {
          console.log(`Player ${user_id}, already in the room`)
          return
        }


        // const existUser = await redisClient.EXISTS(`player:${user_id}`)
        // if (existUser) {
        //   console.log('player already in room')
        //   return
        // }

        await redisClient.sAdd(`room:${room_id}:players`, String(user_id))
        await redisClient.expire(`room:${room_id}:players`, 3600);
        
        
        await redisClient.hSet(`player:${user_id}`,{username:username,avatar_id:avatar_id,room:room_id}, )
        await redisClient.expire(`player:${user_id}`,3600);

        await redisClient.set(`player:${socket.id}`,user_id)
        await redisClient.expire(`player:${socket.id}`, 3600);


  



        //recieve player dataa
        socket.join(room_id);

        // Retrieve player data
        const playerIds = await redisClient.sMembers(`room:${room_id}:players`);
    
        const playerData = await Promise.all(
          playerIds.map(async (playerId) => {
            const [username, avatarId] = await Promise.all([
              redisClient.hGet(`player:${playerId}`, 'username'),
              redisClient.hGet(`player:${playerId}`, 'avatar_id')
            ]);
            return { user_id: playerId, username, avatar_id: avatarId };
          })
        );
    
        // Emit player data to the client who just joined
  
    
        // Optionally, emit to all clients in the room that a new player has joined
        socket.to(room_id).emit('player_joined', playerData);
    }catch(error) {
      log.red('error joining room',error)
 
    }
  })

  socket.on('send_answer', async (data) => {
    const { room_id, question_id, user_id, answer,answer_id, point } = data;
    try {
      const existsRoom = await redisClient.EXISTS(`room:${room_id}`)
      if (!existsRoom) {
        console.log(`${room_id} Room doesn't exist or hasn't been created yet`)
        return
      }
      
      await redisClient.sAdd(`room:${room_id}:questions`, String(question_id))
      await redisClient.expire(`room:${room_id}:questions`, 3600);
      // Store the answer and point as a JSON string
      const answerData = JSON.stringify({ answer,answer_id, point });
      await redisClient.hSet(`answers:${room_id}:${question_id}`, user_id, answerData);
      await redisClient.expire(`answers:${room_id}:${question_id}`, 3600);
  
      // Retrieve answer data for the current question
      const answerCounts = await redisClient.hGetAll(`answers:${room_id}:${question_id}`);
      
      // Calculate answer statistics
      const answerStats = Object.entries(answerCounts).reduce((acc, [_, data]) => {
        const { answer, point } = JSON.parse(data);
        if (!acc[answer]) {
          acc[answer] = { count: 0, totalPoints: 0 };
        }
        acc[answer].count += 1;
        acc[answer].totalPoints += point;
        return acc;
      }, {});
      
      const answerDatas = [
        { 
          option: "A", 
          value: answerStats["A"] && answerStats["A"].count || 0, 
          points: answerStats["A"] && answerStats["A"].totalPoints || 0, 
          color: '#e53935' 
        },
        { 
          option: "B", 
          value: answerStats["B"] && answerStats["B"].count || 0, 
          points: answerStats["B"] && answerStats["B"].totalPoints || 0, 
          color: '#00695c' 
        },
        { 
          option: "C", 
          value: answerStats["C"] && answerStats["C"].count || 0, 
          points: answerStats["C"] && answerStats["C"].totalPoints || 0, 
          color: '#f57c00' 
        },
        { 
          option: "D", 
          value: answerStats["D"] && answerStats["D"].count || 0, 
          points: answerStats["D"] && answerStats["D"].totalPoints || 0, 
          color: '#1e88e5' 
        },
      ];
      
         // Calculate the total number of players who answered
    const totalAnswered = Object.keys(answerCounts).length;
// 
    // Retrieve the total number of players in the room

    // Emit the answer data and total answered players
    socket.to(room_id).emit("receive_answers_data", {
      answerDatas,
      totalAnswered,
    });
  
    } catch (error) {
      console.error('Error processing answer:', error);
      socket.emit('answer_error', 'Failed to process answer');
    }
  });


  socket.on('get_leaderboard', async (data) => {
    const { room_id } = data;
    try {
      // Get all question IDs for the room
      const questionIds = await redisClient.sMembers(`room:${room_id}:questions`);
      if (!questionIds.length) {
        socket.emit('leaderboard_data', { message: 'No questions found for the room.' });
        return;
      }
  
      // Aggregate points per user_id across all questions
      const userPoints = {};
      for (const question_id of questionIds) {
        const answerCounts = await redisClient.hGetAll(`answers:${room_id}:${question_id}`);
        Object.entries(answerCounts).forEach(([user_id, data]) => {
          const { point } = JSON.parse(data);
          userPoints[user_id] = (userPoints[user_id] || 0) + point; // Sum points for each user
        });
      }
  
      // Get player IDs for the room
      const playerIds = await redisClient.sMembers(`room:${room_id}:players`);
      
      // Fetch player data and combine with aggregated points
      const leaderboard = await Promise.all(
        playerIds.map(async (playerId) => {
          const [username, avatarId] = await Promise.all([
            redisClient.hGet(`player:${playerId}`, 'username'),
            redisClient.hGet(`player:${playerId}`, 'avatar_id')
          ]);
          const points = userPoints[playerId] || 0; // Default to 0 if no points are recorded
          return { user_id: playerId, username, avatar_id: avatarId, points };
        })
      );
  
      // Sort leaderboard by points in descending order
      leaderboard.sort((a, b) => b.points - a.points);
  
      // Emit the leaderboard data back to the client
      socket.emit('leaderboard_data', leaderboard);
    } catch (error) {
      console.error('Error processing leaderboard:', error);
      socket.emit('leaderboard_error', 'Failed to retrieve leaderboard');
    }
  });

  
  
  socket.on("next_question",async (data)=> {
    const { room_id,current_question,} = data
    try{
      const existsRoom = await redisClient.EXISTS(`room:${room_id}`)
      if (!existsRoom) {
        console.log(`${room_id} Room doesnt exists or created yet`)
        return
      }

      await redisClient.hSet(`room:${room_id}`, {current_question:current_question})
      
      

      
      socket.to(room_id).emit("current_question",current_question)

    }catch(error){
      console.log(error)
    }
  })

  //send send_room_detail


  
  
  socket.on('disconnect',async() => {
    try{
    
      //if player left the room
      const player = await redisClient.get(`player:${socket.id}`)
      if (player) {
       
    // Retrieve the room the player was in
        const room = await redisClient.hGet(`player:${player}`, 'room');
        if (!room) {
          log.red('Room not found for player:', player);
          return;
        }

        // Remove player from room and cleanup
        await redisClient.del(`player:${socket.id}`);
        await redisClient.del(`player:${player}`);
        await redisClient.sRem(`room:${room}:players`, player);

        // Retrieve updated player list
        const playerIds = await redisClient.sMembers(`room:${room}:players`);
        const playerData = await Promise.all(
          playerIds.map(async (playerId) => {
            const [username, avatarId] = await Promise.all([
              redisClient.hGet(`player:${playerId}`, 'username'),
              redisClient.hGet(`player:${playerId}`, 'avatar_id')
            ]);
            return { user_id: playerId, username, avatar_id: avatarId };
          })
        );

        // Notify remaining players in the room
        socket.to(room).emit('player_joined', playerData);
        return
      }

      //if operator left the room
      const room = await redisClient.get(`operator:id:${socket.id}`)
      if (room) {
        socket.to(room).emit('operator_left','operator are leaving the game, kick everyone out')
        //delete the room from redis

        const keysToDelete = await redisClient.keys(`room:${room}*`);
        for (const key of keysToDelete) {
          await redisClient.del(key);
        }
        const answerToDelete = await redisClient.keys(`answers:${room}*`);
        for (const key of answerToDelete) {
          await redisClient.del(key);
        }
        await redisClient.del(`operator:id:${socket.id}`)
        await redisClient.del(`operator:room:${room}`)

        return
      }
    }catch(error){
      log.red(error)
    }
    log.blue('User disconnected');
  });
});



app.get('/',(req,res)=>{
  res.send('hello world')
})

app.use(express.json());



//HTTP RESt CRUD
app.use("/api/quizz", quizRouter);
app.use("/api/question", questionRouter);
app.use("/api/game", gameRouter);
app.use("/api/answer",answerRouter)
app.use("/api/result-records", resultRecordRouter);
app.use("/api/player", playerRouter);
app.use("/api/user",userRouter)
app.use("/api/media",mediaRouter)
app.use("/api/mediaQuestion",mediaQuestionRouter)


server.listen(3030,()=> {
    log.green('Server is Running')
})






