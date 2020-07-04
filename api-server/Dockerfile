# Get Go Lang (1.14)
FROM golang:1.14

# Copy Content from here to /src
COPY . /src
WORKDIR /src 
RUN go build .

EXPOSE 8080
CMD ["./api-server"]