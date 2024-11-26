pipeline {
  agent any
  
  environment {
    PORT = '5001' 
    IMAGE_NAME = 'qsocket_nest_image' 
    APP_NAME = 'QSOCKET_NEST_APP' 
    GEMINI_API_KEY = credentials('gemini-api-key-credential-id')
    MONGODB_URI = credentials('id_mongo_connect')
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
        sh """
          docker build \
            --build-arg GEMINI_API_KEY=${GEMINI_API_KEY} \
            --build-arg MONGODB_URI=${MONGODB_URI} \
            -t ${IMAGE_NAME} .
        """
      }
    }

    stage('Launch the app in the docker container') {
      steps {
        script {
          sh """
            docker run -dp ${PORT}:3000 \
              -e GEMINI_API_KEY=${GEMINI_API_KEY} \
              -e MONGODB_URI=${MONGODB_URI} \
              --name ${APP_NAME} ${IMAGE_NAME}
          """
        }
      }
    }
  }
}
