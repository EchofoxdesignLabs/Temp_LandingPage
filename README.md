# Echofox 2.0 - "Something's Cooking" Landing Page 🚀

![Echofox 2.0 Landing Page Demo](./screenshot.jpg "Screenshot of the landing page")

This repository contains the code for a dynamic and interactive "coming soon" landing page for Echofox 2.0. It's built with React and features a unique 3D animated background powered by Three.js, an email notification system, and a custom animated favicon.

---

## ✨ Features

* **Interactive 3D Background:** A subtle, animated background rendered with Three.js, responding to mouse movement.
* **Email Notification System:** Users can subscribe to be notified.
    * Sends a notification email to the site owner.
    * Sends an automated confirmation email to the user.
* **Custom Animated Favicon:** A frame-by-frame favicon animation controlled by JavaScript for cross-browser compatibility.
* **Local Font Integration:** Uses the "Axiforma" font hosted locally within the project.
* **Modern & Responsive Design:** A clean, left-aligned layout based on the Figma prototype.

---

## 🔧 Tech Stack

* **Frontend:** [React](https://reactjs.org/) (bootstrapped with Vite)
* **3D Graphics:** [Three.js](https://threejs.org/)
* **Email Service:** [EmailJS](https://www.emailjs.com/)

---

## ⚙️ Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v16 or later)
* npm or yarn

### Installation

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/your-username/your-repository-name.git](https://github.com/your-username/your-repository-name.git)
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd your-repository-name
    ```
3.  **Install NPM packages:**
    ```sh
    npm install
    ```
4.  **Set up environment variables:**
    * Create a new file in the root of your project named `.env`.
    * Copy the contents of `.env.example` (below) into your new `.env` file and add your actual EmailJS credentials.
    
    **.env.example**
    ```
    # Get these from your EmailJS dashboard
    # [https://dashboard.emailjs.com/admin](https://dashboard.emailjs.com/admin)
    
    VITE_EMAILJS_SERVICE_ID=YOUR_SERVICE_ID
    VITE_EMAILJS_ADMIN_TEMPLATE_ID=YOUR_ADMIN_TEMPLATE_ID
    VITE_EMAILJS_USER_TEMPLATE_ID=YOUR_USER_CONFIRM_TEMPLATE_ID
    VITE_EMAILJS_PUBLIC_KEY=YOUR_PUBLIC_KEY
    ```
5.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:5175/`.

---

## 🛠️ Configuration

For the project to function correctly, ensure the following has been configured.

### 1. Static Assets

All static assets (fonts, 3D models, favicon frames) must be placed in the `public` directory with the following structure:
Of course. Here is a complete README.md file for your GitHub project, summarizing all the features we've built together.

You can copy and paste the content below into a new file named README.md in the root of your project folder.

Markdown

# Echofox 2.0 - "Something's Cooking" Landing Page 🚀

![Echofox 2.0 Landing Page Demo](./screenshot.jpg "Screenshot of the landing page")

This repository contains the code for a dynamic and interactive "coming soon" landing page for Echofox 2.0. It's built with React and features a unique 3D animated background powered by Three.js, an email notification system, and a custom animated favicon.

---

## ✨ Features

* **Interactive 3D Background:** A subtle, animated background rendered with Three.js, responding to mouse movement.
* **Email Notification System:** Users can subscribe to be notified.
    * Sends a notification email to the site owner.
    * Sends an automated confirmation email to the user.
* **Custom Animated Favicon:** A frame-by-frame favicon animation controlled by JavaScript for cross-browser compatibility.
* **Local Font Integration:** Uses the "Axiforma" font hosted locally within the project.
* **Modern & Responsive Design:** A clean, left-aligned layout based on the Figma prototype.

---

## 🔧 Tech Stack

* **Frontend:** [React](https://reactjs.org/) (bootstrapped with Vite)
* **3D Graphics:** [Three.js](https://threejs.org/)
* **Email Service:** [EmailJS](https://www.emailjs.com/)

---

## ⚙️ Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v16 or later)
* npm or yarn

### Installation

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/your-username/your-repository-name.git](https://github.com/your-username/your-repository-name.git)
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd your-repository-name
    ```
3.  **Install NPM packages:**
    ```sh
    npm install
    ```
4.  **Set up environment variables:**
    * Create a new file in the root of your project named `.env`.
    * Copy the contents of `.env.example` (below) into your new `.env` file and add your actual EmailJS credentials.
    
    **.env.example**
    ```
    # Get these from your EmailJS dashboard
    # [https://dashboard.emailjs.com/admin](https://dashboard.emailjs.com/admin)
    
    VITE_EMAILJS_SERVICE_ID=YOUR_SERVICE_ID
    VITE_EMAILJS_ADMIN_TEMPLATE_ID=YOUR_ADMIN_TEMPLATE_ID
    VITE_EMAILJS_USER_TEMPLATE_ID=YOUR_USER_CONFIRM_TEMPLATE_ID
    VITE_EMAILJS_PUBLIC_KEY=YOUR_PUBLIC_KEY
    ```
5.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:5175/`.

---

## 🛠️ Configuration

For the project to function correctly, ensure the following has been configured.

### 1. Static Assets

All static assets (fonts, 3D models, favicon frames) must be placed in the `public` directory with the following structure:

public/
├── assets/
│   ├── fonts/
│   │   ├── Axiforma-Regular.ttf
│   │   └── Axiforma-Bold.ttf
│   └── models/
│       └── contour.glb
├── tile000.png
├── tile001.png
...
└── tile134.png

### 2. EmailJS Setup

This project relies on **EmailJS** to handle form submissions without a dedicated backend.

1.  **Create a free account** at [EmailJS.com](https://www.emailjs.com/).
2.  **Connect an Email Service** (e.g., Gmail) and note the **Service ID**.
3.  **Create two Email Templates:**
    * One for the notification sent **to you** (the admin). Note the **Template ID**.
    * One for the confirmation sent **to the user**. Note the **Template ID**.
4.  **Find your Public Key** in the "Account" section of the dashboard.
5.  Add these three IDs and your Public Key to the `.env` file as described in the installation steps.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.