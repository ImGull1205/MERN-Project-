# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

Cách chạy chương trình trên vscode , cài đặt vite , yarn , npm 

**Bước 1** : Tạo 2 terminal , 1 cho frontend và 1 cho api(backend)

**Bước 2** : Trên terminal chạy tiến trình frontend , dùng lệnh **yarn install** để biên dịch cài đặt các package sử dụng yarn (khuyến khích) hoặc **npm** nếu sử dụng npm

**Bước 3** : Sau khi tiến hành cài đặt , trên terminal chạy tiến trình frontend , dùng lệnh **yarn dev**

**Bước 4** : Trên terminal chạy tiến trình backend sử dụng nodemon index.js để chạy server , cho đến khi 2 dòng chữ trắng : 
**Server is running on port 4000**
**MongoDB connected**
là đã chạy thành công server
**Bước 5** : sau khi hoàn tất chạy server , trên terminal chạy tiến trình frontend sẽ hiển thị như sau : 

  **VITE v6.0.6  ready in 1783 ms**

  **➜  Local:   http://localhost:5173/**
  **➜  Network: use --host to expose**
  **➜  press h + enter to show help**
giữ ctrl và nhấn vào dòng **http://localhost:5173/** để xem giao diện trang web 

-> có thể tùy chỉnh database trong .env của api(backend) :
**MONGO_URL="mongodb+srv://bogiakuro1245:12052003@cluster0.jbefs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"**
-----------------------------**tài khoản:mật khẩu@tên cluster----------------------------------------------------=tên cluster**

thay thế các trường tài khoản , mật khẩu , cluster nói trên để tùy chỉnh database đến mongoDB của bạn 