# Disagro FakeShop

## API
https://juandiguti-77048096-4047191.postman.co/workspace/My-Workspace~3019a793-519e-41c0-8159-c7cf757c6c97/collection/48717240-c69711c8-9547-40d7-b334-203c2f3ce354?action=share&creator=48717240&active-environment=48717240-6c0e81a3-1a8d-4dfe-bada-403eb9ed5a55

## ¿De qué se trata?
Disagro FakeShop es una tienda en línea ficticia que sirve como demostración. Permite explorar un catálogo de productos, simular compras y conocer cómo sería la experiencia completa de un comercio electrónico de Disagro, desde descubrir artículos hasta recibir confirmaciones por correo.

## Lo que puedes hacer
- **Explorar el catálogo**: la página principal de productos trae la información desde un catálogo público y la muestra con imágenes, precios y un botón para sumar al carrito.
- **Crear una cuenta y entrar con tu correo**: el sistema guarda a cada persona usuaria, protege la contraseña y mantiene la sesión abierta mediante cookies seguras.
- **Armar un carrito y realizar pedidos**: al confirmar una compra, el backend calcula subtotales, aplica cupones y registra la orden para que puedas revisarla más tarde.
- **Aplicar cupones de descuento**: existen cupones administrados desde un panel especial que solo puede usar el equipo autorizado.
- **Recibir correos de confirmación**: después de cada pedido se envía un correo automático con el detalle para la persona compradora.

## ¿Cómo está construido?
El proyecto está dividido en dos piezas que se comunican entre sí:

1. **Sitio web (frontend)**: creado con Next.js, genera las páginas que ves en el navegador, se conecta con el backend para iniciar sesión, manejar el carrito y consultar datos propios de la persona usuaria.
2. **Servicio principal (backend)**: desarrollado con Express sobre Node.js. Expone las rutas para autenticación, pedidos y cupones, y se encarga de enviar correos cuando se registra una orden.
3. **Base de datos en la nube**: usa MongoDB Atlas para guardar cuentas, pedidos y cupones de forma centralizada y segura.

Estas partes están preparadas para ejecutarse en contenedores de Docker, lo que facilita desplegar la tienda completa con un solo comando cuando se utiliza Docker Compose.

## Recorrido típico
1. Una persona visita la tienda y navega por el catálogo público de productos.
2. Si desea comprar, crea una cuenta o inicia sesión para guardar su historial.
3. Agrega artículos al carrito, introduce un cupón (si tiene uno) y confirma la compra.
4. El sistema genera la orden, calcula descuentos y envía un correo de confirmación.
5. El equipo de Disagro puede entrar al panel administrativo para crear o pausar cupones.

## ¿Por qué es útil?
- Resume en un solo lugar las interacciones clave de un e-commerce real sin requerir conocimientos técnicos.
- Permite mostrar a clientes y al equipo interno cómo se vería y se sentiría una tienda digital de Disagro.
- Sirve de base para futuras iteraciones, pruebas de concepto o demostraciones comerciales.
