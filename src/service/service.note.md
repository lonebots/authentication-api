### service notes

- The controllers are not going to talk to the database directly. 
- Thus, they make use of the services to handle any databse operations. 
- The services in turn use the model to interact with the database.
- `Partial` - comes from typescript and allows the user to use any of selected properties from an interface.