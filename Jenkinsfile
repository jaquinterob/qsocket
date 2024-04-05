pipeline {
  agent any
  
  environment {
    PORT = '5001' 
    IMAGE_NAME = 'qsocket_nest_image' 
    APP_NAME = 'QSOCKET_NEST_APP' 
  }
  
  stages {
    stage('Stop Docker container') {
      steps {
        script {
          try {
            sh "docker stop $APP_NAME"
          } catch (Exception e) {
            echo "No running container found with the name $APP_NAME"
          }
        }
      }
    }
    
    stage('Remove Docker image and container') {
      steps {
        script {
          try {
            sh "docker rm $APP_NAME"
            sh "docker rmi $IMAGE_NAME"
          } catch (Exception e) {
            echo "No image or container found with the specified names"
          }
        }
      }
    }
    
    stage('Docker build') {
      steps {
        sh "docker build -t $IMAGE_NAME ."
      }
    }

    stage('Launch the app in the docker container') {
      steps {
        script {
          withCredentials([string(credentialsId: 'MONGO_CONNECT', variable: 'MONGO_CONNECT')]) {
            sh "docker run -dp $PORT:3000 --name $APP_NAME -e MONGO_CONNECT=$MONGO_CONNECT $IMAGE_NAME"
           }
        }
      }
    }
  }

}
