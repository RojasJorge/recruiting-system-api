require('crypto').randomBytes(256, function(err, buffer) { 
  const token = buffer.toString('base64')
  console.log(token)
})