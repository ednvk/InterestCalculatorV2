pipeline {
  agent any

  stages {
      
    stage('Checkout'){ 
        steps { 
            checkout scm 
        } 
        
    }

    // stage('Checkout') {
    //   steps {
    //     git branch: 'main',
    //     url: 'https://github.com/ednvk/InterestCalculatorV2.git'
    //   }
    // }

    stage('SonarQube Scan') {
      steps {
        script {
          // Use the SonarQube server configuration called "MySonar"
          withSonarQubeEnv('sonar-v25') {
            // Resolve scanner installed in Jenkins Tools as "SonarScanner"
            def scannerHome = tool 'sonar-v25'
            
            // Run scanner; pass token explicitly
            sh """
              "${scannerHome}/bin/sonar-scanner" \
                -Dsonar.host.url="$SONAR_HOST_URL" \
                -Dsonar.token="$SONAR_AUTH_TOKEN"
            """
            
            // sh "\"${scannerHome}/bin/sonar-scanner\" -v"
            // // Run the scanner (uses sonar-project.properties in repo)
            // sh "\"${scannerHome}/bin/sonar-scanner\""
          }
        }
      }
    }

    stage('Quality Gate') {
      steps {
        timeout(time: 1, unit: 'MINUTES') {
          // Requires the SonarQube webhook to be configured
          waitForQualityGate abortPipeline: true
        }
      }
    }
  }

  post {
    always {
      echo "Pipeline finished (success or fail)."
    }
  }
}
