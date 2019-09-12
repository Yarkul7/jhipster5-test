#!/usr/bin/env groovy

node {
    checkout scm

    stage('Commit stage: build') {
        sh "java -version"
        sh "chmod +x mvnw"
        sh "./mvnw clean"
        sh "./mvnw com.github.eirslett:frontend-maven-plugin:install-node-and-yarn -DnodeVersion=v8.11.3 -DyarnVersion=v1.6.0"
        sh "./mvnw com.github.eirslett:frontend-maven-plugin:yarn"
    }
    stage('Commit stage: backend tests') {
        try {
            sh "./mvnw test"
        } catch(err) {
            throw err
        } finally {
            junit '**/target/surefire-reports/TEST-*.xml'
        }
    }
     stage('Commit stage: frontend tests') {
        try {
            sh "./mvnw com.github.eirslett:frontend-maven-plugin:yarn -Dfrontend.yarn.arguments=test"
        } catch(err) {
            throw err
        } finally {
            // Jenkins pipeline cannot handle the jest report format
            // junit '**/target/test-results/jest/TESTS-*.xml'
        }
    }
    stage('Security testing stage: package and deploy') {
        sh "./mvnw com.heroku.sdk:heroku-maven-plugin:2.0.5:deploy -DskipTests -Pprod -Dheroku.appName=crimdrac-jhipster-5-demo"
        archiveArtifacts artifacts: 'target/*.war', fingerprint: true
        timeout(360) {
            waitUntil {
                try {
                    sh 'curl -o /dev/null -s -I -f https://crimdrac-jhipster-5-demo.herokuapp.com'
                    return true
                } catch (exception) {
                    return false
                }
            }
        }
    }

    stage('Security testing stage: access control tests') {
        try {
            // deploy to security testing stage
            sh "newman run src/test/postman/accesscontrol-tests.json -k -r cli,html --reporter-html-export ./target/newman/accesscontrol-test-report.html"
        } catch(err) {
            throw err
        } finally {
            archiveArtifacts artifacts: 'target/newman/accesscontrol-test-report.html', fingerprint: true
            // undeploy application
        }
    }

    stage('Security testing stage: security scan') {
        try {
            // deploy to security testing stage
            dir('src/test/burp/') {
                sh "burpctl start"
                sh "./crawl.js"
                sh "HTTPS_PROXY=http://localhost:8080 newman run ../postman/accesscontrol-tests.json -k"
                sh "burpctl crawl"
                sh "burpctl scan"
                sh "mkdir -p '${workspace}/target/burp'"
                sh "burpctl report -f '${workspace}/target/burp/security-scan-report.html'"
                sh "burpctl stop"
            }
        } catch(err) {
            throw err
        } finally {
            archiveArtifacts artifacts: 'target/burp/security-scan-report.html'
            // undeploy application
        }
    }
}
