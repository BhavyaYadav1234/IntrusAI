pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "intrusai-backend"
        PATH = "/bin:/usr/bin:/usr/local/bin"  // Ensure the correct path for shell and Docker
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/BhavyaYadav1234/IntrusAI.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '/bin/bash -c "docker build -t $DOCKER_IMAGE ./backend"'  // Explicitly use bash for shell commands
            }
        }

        stage('Stop Existing Container') {
            steps {
                sh '''
                    /bin/bash -c "docker stop intrusai-backend-container 2>/dev/null || true"
                    /bin/bash -c "docker rm intrusai-backend-container 2>/dev/null || true"
                '''
            }
        }

        stage('Run New Container') {
            steps {
                sh '/bin/bash -c "docker run -d --name intrusai-backend-container -p 5200:5200 $DOCKER_IMAGE"'
            }
        }
    }

    post {
        always {
            echo 'Pipeline completed.'
        }
    }
}
