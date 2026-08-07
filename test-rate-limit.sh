for i in {1..25}
do 
curl  -s -X POST http://localhost:3000/shorten -H "Content-Type: application/json" -d '{"longUrl": "https://example.com"}'
  echo ""
done