import React from 'react'



const AddUserPage = async () => {
  const res = await fetch('https: //jsonplaceholder. typicode.com/users');
  const users: User[] = await res.json();

  return (
    <>
      <h1>Users List</h1>
      <ul>
        {users.map((user) => <li key={user.id}>{user.name}</li>)}
      </ul>
    </>
  )
}

export default AddUserPage