--download and install ollama
curl -fsSL https://ollama.com/install.sh | sh

--pull ollama models

ollama pull llama3
ollama pull codellama

--run containers

--build and run the containers using docker-compose

docker-compose up -d --build

--to list sql schema

http://localhost:3000/tools/schema


--to list ollama models

http://localhost:11434/api/tags

--send sample request to the agent

curl -s -X POST "http://localhost:4000/ask" -H "Content-Type: application/json" -d '{"question":"Son 7 günde en çok harcama yapan kullanıcılar kimler?"}' | jq