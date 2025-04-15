const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 邮件发送路由
app.post('/api/send-email', async (req, res) => {
  try {
    const { name, phone, content } = req.body;
    
    // 创建邮件传输器
    const transporter = nodemailer.createTransport({
      service: 'QQ',
      auth: {
        user: process.env.EMAIL_USER || 'ai-agents@foxmail.com',
        pass: process.env.EMAIL_PASS || 'zxcbsgqcriiniihj'
      }
    });

    // 邮件选项
    const mailOptions = {
      from: process.env.EMAIL_USER || 'ai-agents@foxmail.com',
      to: 'ai-agents@foxmail.com',
      subject: `新的合作咨询: ${name}`,
      text: `姓名: ${name}\n联系电话: ${phone}\n咨询内容: ${content}`
    };

    // 发送邮件
    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ success: true, message: '邮件发送成功' });
  } catch (error) {
    console.error('邮件发送失败:', error);
    res.status(500).json({ success: false, message: '邮件发送失败' });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});