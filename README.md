# Ferry
Final year project Ferry uwu

# What you need
- Anaconda (miniconda3)
- React Native
- Expo
- Node.js
- VSCode

# Installation
- Clone the repository
- CD into Ferry, there is 2 Ferry folders, make sure that you are in the second Ferry folder
  ```
  cd Ferry
  ```
- Install all dependencies
  ```
  npm install
  ```

- Open anaconda and create a new python environment
  ```
  conda create --name [Enter name here] python=3.10
  ```
- cd into the repository and then install the libraries
  ```
  pip install -r requirements.txt
  ```
- Make the database migrations
  ```
  python manage.py makemigrations
  python mange.py migrate
  ```

# Running
- Open the anaconda console and run the backend server
  ```
  python manage.py runserver 0.0.0.0:8000
  ```
- In the repository folder on vscode cd into the second ferry folder and run
  ```
  cd Ferry
  npx expo start
  ```
- Scan QR code in the expo app and wait for the android bundling to be complete

# Issues
In order for the backend to work properly, you will need to make sure that all the fetch API code has your PC IP address on it:
```
const id_request = await fetch(`http://[PC IP ADDRESS]:8000/api/get+user+with+email/?user_email=${email}`)
```
Otherwise the backend wont connect and there will be no access to the database


