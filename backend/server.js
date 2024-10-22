const express = require("express");
const pool = require("./db");
const app = express();
const axios = require("axios");
const http = require("http");
const dotenv = require("dotenv");
const crypto = require("crypto");
const cors = require("cors");
const nodemailer = require("nodemailer");

const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

dotenv.config();

app.use(cors());
app.use(express.json());


app.get("/organizations", async (req, res) => {
  const { id } = req.query;

  try {
    const organizations = await pool.query(
      "SELECT * FROM organizations WHERE owner_id = $1",
      [id]
    );

    res.send(organizations.rows);
  } catch (error) {
    console.log(error);
  }
});

app.post("/organizations/create", async (req, res) => {
  const { name, owner_id } = req.body;
  try {
    await pool.query(
      "INSERT INTO organizations (name, owner_id) VALUES ($1, $2)",
      [name, owner_id]
    );
    res.send("Organization created");
  } catch (error) {
    console.log(error);
  }
});

app.get("/projects/:org_id", async (req, res) => {
  const org_id = req.params.org_id;
  try {
    const projects = await pool.query(
      "SELECT * FROM projects WHERE organization_id = $1",
      [org_id]
    );
    res.send(projects);
  } catch (error) {
    console.log(error);
  }
});

app.get("/organization/users/:org_id", async (req, res) => {
  const org_id = req.params.org_id;
  console.log(org_id);
  
  try {
    const users = await pool.query(
      "SELECT * FROM userorganizations WHERE organization_id = $1",
      [org_id]
    );
    res.send(users.rows);
  } catch (error) {
    console.log(error);
  }
});

app.post("/projects/create", async (req, res) => {
  const { name, organization_id } = req.body;
  try {
    await pool.query(
      "INSERT INTO projects (name, organization_id) VALUES ($1, $2)",
      [name, organization_id]
    );
    res.send("Project created");
  } catch (error) {
    console.log(error);
  }
});

app.post("/insertSections", async (req, res) => {
  const { board_id, name, position } = req.body;

  console.log(req.body);
  try {
    await pool.query(
      "INSERT INTO sections (board_id ,name ,position) VALUES ($1,$2,$3)",
      [board_id, name, position]
    );
    res.send("Board created");
  } catch (error) {
    console.log(error);
  }
});

app.get("/", (req, res) => {
  res.status(200).send("Server is running");
});

const generateInviteToken = () => {
  const inviteToken = crypto.randomBytes(32).toString("hex");
  return inviteToken;
};

const generateInviteLink = (token, organizationId) => {
  const inviteLink = `${process.env.CLIENT_URL}/invite?token=${token}&org=${organizationId}`;
  return inviteLink;
};

const saveInvitation = async(organizationId, email, inviteLink, inviterName, organizationName, inviteToken) => {
  try {
    await pool.query(
      "INSERT INTO invitations (organization_id, email, token) VALUES ($1,$2,$3)",
      [organizationId, email, inviteToken]
    );
    console.log("Invitation saved");
    const message =await sendInviteEmail(
      email,
      inviteLink,
      inviterName,
      organizationName
    );
    // console.log('Status Message',message);
    return message;
  } catch (error) {
    console.log("Error sending invitation", error);
  }
};

app.post('/invite', async(req,res)=>{
    const {inviterName, organizationId, email, organizationName} = req.body;

    const inviteToken = generateInviteToken();

    const inviteLink = generateInviteLink(inviteToken, organizationId);
    if(inviteLink){
        const message = await saveInvitation(organizationId, email, inviteLink, inviterName, organizationName, inviteToken);
        res.json({ message });
    }
    else{
        res.status(404).send("Error saving invitation");
    }
})

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.OUR_EMAIL,
    pass: process.env.OUR_PASSWORD,
  },
});

const sendInviteEmail = async (inviteEmail, inviteLink, inviterName, organizationName) => {
  try {
    const info = await transporter.sendMail({
      from: '"Zenflow" <app.zenflow@gmail.com>',
      to: inviteEmail,
      subject: "You are Invited to Join an Organization",
      text: `Hello,
        
        You have been invited to join the organization "${organizationName}" by ${inviterName}.
        
        Click this link to register and join: ${inviteLink}
        
        Best regards,
        The Zenflow Team`,
      html: `<p>Hello,</p>
                   <p>You have been invited to join the organization <strong>${organizationName}</strong> by <strong>${inviterName}</strong>.</p>
                   <p>Click the link to register and join: <a href="${inviteLink}">Register</a></p>
                   <p>Best regards,<br/>The Zenflow Team</p>`,
    });

    console.log("Invitation sent successfully", info.messageId);
    return {
      success: true,
      message: "Invitation sent successfully",
      messageId: info.messageId,
    };
  } catch (error) {
    console.log("Error sending mail", error);
    return {
      success: false,
      message: "Error sending mail",
      error: error.message,
    };
  }
};

const pingServer = () => {
  axios
    .get(process.env.SERVER_URL)
    .then((response) => {
      console.log("Ping successful:", response.status);
    })
    .catch((error) => {
      console.error("Ping failed:", error.message);
    });
};
setInterval(pingServer, 300000);

const registerdUsers = {}

io.on('connection', (socket) => {
  // console.log('A user connected', socket.id);

  socket.on('register',(data)=>{
    registerdUsers[data] = socket.id;
    console.log(`User registered with ID: ${data} and socket ID: ${socket.id}`);
  })

  socket.on('notification', (data) => {
    console.log('Received notification:', data);
    
    const userSoceketId = registerdUsers[data.userId];
    if (userSoceketId) {
      io.to(userSoceketId).emit('notification', data);
    } else {
      console.log(`User with ID: ${data.userId} not found.`);
    }
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
    
    // Remove the userId associated with this socket if needed
    for (const userId in registerdUsers) {
      if (registerdUsers[userId] === socket.id) {
        delete registerdUsers[userId]; // Clean up the mapping
        console.log(`User with ID: ${userId} disconnected.`);
      }
    }
  });

})

const PORT = 8000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
