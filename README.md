# Ferry
Final year project Ferry uwu

# What you need
- Anaconda (miniconda3)
- React Native
- Expo Go (mobile phone application)
  - Note: This application has only been tested on an android device, so there may be unexpected errors on an IOS device or on an emulator.
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

- Open anaconda and create a new python environment before activating it
  ```
  conda create --name [Enter name here] python=3.10
  conda activate [Enter name here]
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
# Before running
In order for the database to connect to the frontend you need to enter your IP address in the IPAddress.js in the format [IPaddress]:8000
If a correct IPaddress is not entered then your application will not be connected to the database and will produce errors.
If you are running from an android emulator on the same pc (and not a seperate device) you may be able to use localhost instead.

## IPAddress.js location
```
Ferry > Ferry > components > IPAddress.js
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
- Scan QR code in the expo go app and wait for the android bundling to be complete



