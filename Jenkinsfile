pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "intrusai-backend"
    }

    stages {
        stage('Clean Workspace') {
            steps {
                // Clean the workspace to avoid issues with leftover files
                deleteDir()  // Cleans the workspace before starting
            }
        }

        stage('Checkout Code') {
            steps {
                // Checkout the code from GitHub repository
                git branch: 'main', url: 'https://github.com/BhavyaYadav1234/IntrusAI.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                // Build the Docker image using the Dockerfile in the backend folder
                sh '''#!/bin/bash
                echo "Building Docker image..."
                docker build -t $DOCKER_IMAGE ./backend
                '''
            }
        }

        stage('Stop Existing Container') {
            steps {
                // Stop and remove any existing containers if they exist
                sh '''#!/bin/bash
                echo "Stopping existing container if exists..."
                docker stop intrusai-backend-container 2>/dev/null || true
                docker rm intrusai-backend-container 2>/dev/null || true
                '''
            }
        }

        stage('Run New Container') {
            steps {
                // Run the newly built container
                sh '''#!/bin/bash
                echo "Running new container..."
                docker run -d --name intrusai-backend-container -p 5200:5200 $DOCKER_IMAGE
                '''
            }
        }
    }

    post {
        always {
            // Cleanup or notify after the pipeline finishes
            echo 'Pipeline completed.'
        }
    }
}
