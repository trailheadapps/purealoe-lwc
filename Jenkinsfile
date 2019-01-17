#!groovy
import groovy.json.JsonSlurperClassic

def runSFDXCommand(command) {
    rmsg = sh returnStdout: true, script: command
    echo rmsg
    def jsonSlurper = new JsonSlurperClassic()
    def robj = jsonSlurper.parseText(rmsg)
    if (robj.status != 0) {
        error robj.message
    }
    return robj
}

node {
    def RUN_ARTIFACT_DIR="tests/${BUILD_NUMBER}"

    def HUB_ORG='ben.ohana1-rt4c@force.com'
    def SFDC_HOST = 'https://login.salesforce.com'
    def JWT_KEY_CRED_ID = '73102523-89c2-494f-95f9-7a04c17b026e'
    def CONNECTED_APP_CONSUMER_KEY = '3MVG9SemV5D80oBfX5V_lRn5hLK6hxrB_Ioyi295ZdmsdyHUomb2rekA3f3ww42c.ae2OZnO5NHMooaNnv.sP'

    def SFDC_USERNAME
    stage('Init') {
        re = sh returnStdout: true, script: "sfdx plugins"
        if (!re.contains('pre-release')) {
            sh script: "sfdx plugins:install salesforcedx@pre-release"
        }
        res = runSFDXCommand("sfdx force:org:list --json")
        res.result.scratchOrgs.each { item ->
            re = sh returnStdout: true, script: "sfdx force:org:delete --targetusername ${item.username} -p"
        }
    }
    stage('Checkout Source') {
        git url: 'https://github.com/Benoh/purealoe-lwc.git'
    }
    withCredentials([file(credentialsId: JWT_KEY_CRED_ID, variable: 'jwt_key_file')]) {
        stage('Connect Dev Hub') {
            runSFDXCommand("sfdx force:auth:jwt:grant --clientid ${CONNECTED_APP_CONSUMER_KEY} --username ${HUB_ORG} --jwtkeyfile \"/${jwt_key_file}\" --instanceurl ${SFDC_HOST} -d --json")
        }
        stage('Create Scratch Org') {
            response = runSFDXCommand("sfdx force:org:create --definitionfile config/project-scratch-def.json --json --setdefaultusername")
            SFDC_USERNAME = response.result.username
        }
        stage('Push To Scretch Org') {
            runSFDXCommand("sfdx force:source:push --targetusername ${SFDC_USERNAME} --json")
            runSFDXCommand("sfdx force:user:permset:assign --targetusername ${SFDC_USERNAME} --permsetname purealoe --json")
        }
        stage('Run Apex Test') {
            sh "mkdir -p ${RUN_ARTIFACT_DIR}"

            re = sh returnStatus: true, script: "sfdx force:apex:test:run --testlevel RunLocalTests --outputdir ${RUN_ARTIFACT_DIR} --resultformat junit --targetusername ${SFDC_USERNAME}"
            if (re != 0) {
                error "Error running test"
            }
        }
        stage('Collect Result') {
            junit keepLongStdio: true, testResults: 'tests/**/*-junit.xml'
        }
        stage('Cleanup') {
            re = sh returnStdout: true, script: "sfdx force:org:delete --targetusername ${SFDC_USERNAME} -p"
            re = sh returnStdout: true, script: "sfdx force:org:list --clean"
        }
    }
}