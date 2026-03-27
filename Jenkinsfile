pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Lint & Test') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t employee-management-system:${BUILD_NUMBER} .'
                sh 'docker tag employee-management-system:${BUILD_NUMBER} employee-management-system:latest'
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker stop ems-app || true'
                sh 'docker rm ems-app || true'
                sh 'docker run -d --name ems-app -p 80:80 employee-management-system:latest'
            }
        }
    }

    post {
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Build or deployment failed.'
        }
    }
}
