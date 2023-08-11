# PASOS
    - Lanzar el comando 'npm run populate' para poblar la base de datos.
    - Lanzar el comando 'npm run start'.

# Libros
| Solicitud HTTP | Endpoint         | Descripción                 |
| -------------- | ---------------- | --------------------------- |
| GET            | /libros          | Todos los libros           |
| GET            | /libros/:id       | Libro por ID               |
| GET            | /libros/populate/:id | Libro por ID y autor    |
| POST           | /libro           | Crear libro*             |
| PUT            | /libro/:id       | Actualizar libro por ID*    |
| DELETE         | /libro/:id       | Borrar libro por ID*   |

# Autores
| Solicitud HTTP | Endpoint         | Descripción                 |
| -------------- | ---------------- | --------------------------- |
| GET            | /autores          | Todos los autores           |
| GET            | /autores/:id       | Autor por ID               |
| GET            | /autores/populate/:id | Autor por ID con libros escritos |
| POST           | /autores           | Crear autor*                |
| PUT            | /autores/:id       | Actualizar autor por ID*   |
| PUT            | /autores/:idAutor/:idLibro       | Añadir o eliminar libro escrito por un autor*    |
| DELETE         | /autores/:id       | Borrar autor por ID*        |

# Usuarios
| Solicitud HTTP | Endpoint         | Descripción                 |
| -------------- | ---------------- | --------------------------- |
| GET            | /users          | Todos los usuarios*          |
| GET            | /users/:id       | Usuario por ID*           |
| DELETE         | /users/:id       | Borrar usuario por ID*        |

# Autenticación
| Solicitud HTTP | Endpoint         | Descripción                 |
| -------------- | ---------------- | --------------------------- |
| POST            | /auth/register          | Registrar un usuario (email y contraseña)          |
| POST            | /auth/login          | Iniciar sesión          |


*: Es necesaria autenticación mediante un token válido en el campo 'Authorization/Auth' - 'Bearer'.

Para obtener un token válido, registra un usuario con 'email' y 'password' donde la contraseña tenga al menos 6 caracteres y mínimo una mayúscula y una minúscula. Los tokens válidos se muestran en la respuesta a la solicitud al iniciar sesión.

--- 

## Funciones notables e indicaciones

### Libros

* __*POST /libro:*__

    Al crear un libro, la bases de datos comprueba que se haya introducido un título, un nombre del autor, un año de publicación y un género, y después de crear el libro, comprueba si el autor ya existe en la base de datos. En caso positivo, introduce el libro en el array de libros escritos del autor. En caso contrario, será necesario crear el autor de forma manual con el mismo nombre y usar la función PUT /autores/:idAutor/:idLibro para añadirlo a los libros escritos del autor (hasta entonces el campo 'autor' del libro será null)

* __DELETE */libro/:id*__

    Al eliminar un libro, se elimina el libro de la base de datos, y también se elimina la id de dicho libro del array de librosEscritos del autor para evitar inconsistencias.

### Autores

* __PUT */autores/:id*__

    Al actualizar el nombre de un autor, también actualiza el campo 'nombreAutor' de todos los libros que estén en el array de libros escritos. Esto mantiene la consistencia de los datos de una colección con la otra en caso de cambiar el nombre de un autor.

* __PUT */autores/:idAutor/:idLibro*__

    Este endpoint añade o elimina la id de un libro en función de si el libro ya existe en el array de libros escritos de un autor. En caso de estar, lo elimina, y si no estuviera, lo añade. Además, siempre modificará el campo 'nombreAutor' y 'autor' en el libro, por lo que es posible cambiar la autoría de un libro de un autor a otro. 
    
    Por ejemplo: si un libro con *_id:libro1* es escrito por un autor con *_id:autor1*, está en su array de libros escritos y el libro tiene referencia a este autor. Si quisiéramos cambiar la autoría del libro desde el *autor1*, a otro autor con *_id:autor2*, entonces solo habría que hacer *PUT /autores/:autor2/libro1*, y la base de datos se encargaría de eliminar el *libro1* de los libros escritos por el *autor1*, añadir el libro a los libros escritos del *autor2*, y de actualizar el campo 'nombreAutor' del libro y su referencia 'autor' al *autor2*.

* __DELETE */autores/:id*__

    Al eliminar un autor, el campo 'autor' (referencia a la id de su autor) de todos los libros que estén en el array de libros escritos del autor serán puestos a null. Esto es útil para mantener la existencia del libro, pero saber que su autor no ha sido creado aún. En este caso, la creación posterior de un autor con el mismo nombre no hará que el campo 'autor' del libro deje de ser null directamente. Para vincular nuevamente el libro con un autor, es necesario usar la función PUT /autores/:idAutor/:idLibro.
    
