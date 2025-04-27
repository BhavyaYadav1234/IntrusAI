pipeline {

    agent any



    environment {

        DOCKER_IMAGE = "intrusai-backend"

    }



    stages {

        stage('Checkout Code') {

            steps {

                git branch: 'main', url: 'https://github.com/BhavyaYadav1234/IntrusAI.git'

            }

        }



        stage('Build Docker Image') {

            steps {

                sh 'docker build -t $DOCKER_IMAGE ./backend'

            }

        }



        stage('Stop Existing Container') {

            steps {

                sh '''

                    docker stop intrusai-backend-container 2>/dev/null || true

                    docker rm intrusai-backend-container 2>/dev/null || true

                '''

            }

        }



        stage('Run New Container') {

            steps {

                sh 'docker run -d --name intrusai-backend-container -p 5200:5200 $DOCKER_IMAGE'

            }

        }

    }



    post {

        always {

            echo 'Pipeline completed.'

        }

    }

}