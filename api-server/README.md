# Monitoring Platform


## Features: 

1. Site Monitoring
2. API Monitoring
3. System Monitoring with more configuration


## Running Binary

1. Run command (go build .) [It will create api-server]
2. Run command (./api-server) [Hint: As shell command]

## Building Docker

1. docker image build -t codecrash/go-monitoring-server .
2. docker container run -p 8080:8080 codecrash/go-monitoring-server

## Running Project From Docker Hub (image:codecrash/go-monitoring-server)

1. docker pull codecrash/go-monitoring-server
2. docker container run -p 8080:8080 codecrash/go-monitoring-server

## HTTP Method Supports:

1. GET
2. POST

## Prerequisites

1. Go should be install on your system with all the basic setup. (Like Paths)

## How to Run:

1. Clone Repository
2. CD Repository
3. On Shell: Enter Command ```go get``` to install the dependencies
4. On Shell: Enter Command ```go run *.go``` to run the monitoring server

## Learning From:

1. go doc site
2. Stack Overflow site
3. Github issues and Queries
4. https://dev.to/moficodes/build-your-first-rest-api-with-go-2gcj
5. https://medium.com/@masnun/making-http-requests-in-golang-dd123379efe7
6. https://semaphoreci.com/community/tutorials/how-to-deploy-a-go-web-application-with-docker


## TODO

1. Server Setup **[Done]**
2. API Router and API Setup **[Done]**
3. Model Setup **[Done]** (We can add more it we consider auth module)
4. Database Setup [SQLITE3] **[Done]**
5. Query Builder Setup **[Done]**
6. Cron Job setup **[Done]**
7. Logger Setup 
8. Validation [Pending: Name should be unique for database (task table)]
9. Setup Event Emitters
10. Setup Socket on Job Update **[Done]**
11. Customization Schedule Time for Cron Tasks 
12. Disable/Delete cron functionality support on Task/Job
13. Setup Time logger for each and every API calls (Users|Crons)
14. Add Supports for Other HTTP Methods(PUT, PATCH, DELETE, OPTIONS, etc..)
15. Add Proper Error Handling in GET|POST Task Runner in observer package
16. Terminate/StopCronByID API's Pending on Cron/Entry
17. Setup Environment for Server and PORT and Other Things.


## Improvements

1. Separate Services on different servers
2. Add Support for Cacheing Database
3. Add Event Emitters to emits the job status
4. Logger Setup for each and evy activity
5. Add Socket which will be triggered by emitters to send the values real time on client 
6. Cleanup Server: Unlink/Clean/Close/ on Server Crash|Shutdown|Terminate (DB, Crons, DBHelper etc.)
7. Setup Different Database of Table to maintain the Crons Logs with Status or add in existing job table


## Remember (For Pravin Only):

1. Features Pending:
   1. Create Job for any Task
   2. Assign a Feature to Provide Custom Time for the Job (Edit/Add)
   3. Right now, On Client(Entries Task), we don't have task list, we can add task list feature with add only task feature.
   4. We can add Timeout Settings Also, in what time duration the request will time out to notify users (email/sms)
   5. Stop Cron/Delete/Cron/Schedule Job Time Cron
   6. Code Base Cleanup in both repositories
   7. Docker Image Setup **[Done]**
2. Notes:
   1. Right now, After Adding one Task, it will create job also and create entry from (entry=(cron=(task+job))).
   2. That, Entry will be schedule to run in every minute