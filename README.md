# https://full-server-alejandroluzuriaga-render.onrender.com

Para obtener un token válido, registra un usuario con 'email' y 'password' (donde la contraseña tenga al menos 6 caracteres, mínimo una mayúscula y una minúscula) y después, inicia sesión para recibir el token. Los tokens válidos se muestran en la respuesta a la solicitud al iniciar sesión.

# Libros
| Solicitud HTTP | Endpoint         | Descripción                 |
| -------------- | ---------------- | --------------------------- |
| GET            | /libros          | Todos los libros           |
| GET            | /libros/:id       | Libro por ID               |
| GET            | /libros/populate/:id | Libro por ID y autor    |
| POST           | /libros          | Crear libro(*)             |
| PUT            | /libro/:id       | Actualizar libro por ID(*)    |
| DELETE         | /libro/:id       | Borrar libro por ID(*)   |

# Autores
| Solicitud HTTP | Endpoint         | Descripción                 |
| -------------- | ---------------- | --------------------------- |
| GET            | /autores          | Todos los autores           |
| GET            | /autores/:id       | Autor por ID               |
| GET            | /autores/populate/:id | Autor por ID con libros escritos |
| POST           | /autores           | Crear autor(*)                |
| PUT            | /autores/:id       | Actualizar autor por ID(*)   |
| PUT            | /autores/:idAutor/:idLibro       | Añadir o eliminar libro escrito por un autor(*)    |
| DELETE         | /autores/:id       | Borrar autor por ID(*)        |

# Usuarios
| Solicitud HTTP | Endpoint         | Descripción                 |
| -------------- | ---------------- | --------------------------- |
| GET            | /users          | Todos los usuarios         |
| GET            | /users/:id       | Usuario por ID(*)           |
| DELETE         | /users/:id       | Borrar usuario por ID(*)        |

# Autenticación
| Solicitud HTTP | Endpoint         | Descripción                 |
| -------------- | ---------------- | --------------------------- |
| POST            | /auth/register          | Registrar un usuario (email y contraseña)          |
| POST            | /auth/login          | Iniciar sesión          |
| POST            | /auth/avatar          | Actualizar usuario con avatar(*)         |


(*): Es necesaria autenticación mediante un token válido en el campo 'Authorization/Auth' - 'Bearer'.

En el caso de 'Actualizar usuario con avatar' el usuario que se actualizará con un nuevo campo 'avatar' (URL de la imagen en Cloudinary) será el que haya generado el token válido necesario para consumir el endpoint.