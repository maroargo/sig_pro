var bcrypt = require('bcryptjs');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  
  await prisma.role.deleteMany();
  const roleAdmin = await prisma.role.upsert({
    where: { id: '', name: 'Administrador' },
    update: {},
    create: { name: 'Administrador' },
  })  
  await prisma.role.upsert({
    where: { id: '', name: 'Usuario' },
    update: {},
    create: { name: 'Usuario' },
  })
  const roleCoord = await prisma.role.upsert({
    where: { id: '', name: 'Coordinador' },
    update: {},
    create: { name: 'Coordinador' },
  })
  await prisma.role.upsert({
    where: { id: '', name: 'Comité de Gobierno y Transformación Digital' },
    update: {},
    create: { name: 'Comité de Gobierno y Transformación Digital' },
  })
  const roleFunc = await prisma.role.upsert({
    where: { id: '', name: 'Analista Funcional' },
    update: {},
    create: { name: 'Analista Funcional' },
  })
  await prisma.role.upsert({
    where: { id: '', name: 'Programador' },
    update: {},
    create: { name: 'Programador' },
  })
  await prisma.role.upsert({
    where: { id: '', name: 'Documentador' },
    update: {},
    create: { name: 'Documentador' },
  }) 
  await prisma.role.upsert({
    where: { id: '', name: 'Analista de Pruebas' },
    update: {},
    create: { name: 'Analista de Pruebas' },
  })   

  await prisma.organization.deleteMany();
  const orgA = await prisma.organization.upsert({
    where: { id: '', name: 'ONPE - Oficina Nacional de Procesos Electorales' },
    update: {},
    create: { name: 'ONPE - Oficina Nacional de Procesos Electorales', email: 'contacto@onpe.gob.pe', address: 'Jr. Washington 1894, Lima' },
  })
  
  await prisma.gerencia.deleteMany();
  const GITE = await prisma.gerencia.upsert({
    where: { id: '', nombre: 'Gerencia de Informática y Tecnología Electoral' },
    update: {},
    create: { nombre: 'Gerencia de Informática y Tecnología Electoral', siglas: 'GITE', titular: 'Roberto Montenegro', idOrganization: orgA.id },
  }) 
  const GOECOR = await prisma.gerencia.upsert({
    where: { id: '', nombre: 'Gerencia de Organización Electoral y Coordinación Regional' },
    update: {},
    create: { nombre: 'Gerencia de Organización Electoral y Coordinación Regional', siglas: 'GOECOR', titular: 'Ricardo Saavedra', idOrganization: orgA.id },
  })
  const GRH = await prisma.gerencia.upsert({
    where: { id: '', nombre: 'Gerencia de Recursos Humanos' },
    update: {},
    create: { nombre: 'Gerencia de Recursos Humanos', siglas: 'GRH', titular: '-', idOrganization: orgA.id },
  })
  const GPP = await prisma.gerencia.upsert({
    where: { id: '', nombre: 'Gerencia de Planificación y Presupuesto' },
    update: {},
    create: { nombre: 'Gerencia de Planificación y Presupuesto', siglas: 'GPP', titular: '-', idOrganization: orgA.id },
  })
  const GAD = await prisma.gerencia.upsert({
    where: { id: '', nombre: 'Gerencia de Administración' },
    update: {},
    create: { nombre: 'Gerencia de Administración', siglas: 'GAD', titular: '-', idOrganization: orgA.id },
  })
  const GIEE = await prisma.gerencia.upsert({
    where: { id: '', nombre: 'Gerencia de Información y Educación Electoral' },
    update: {},
    create: { nombre: 'Gerencia de Información y Educación Electoral', siglas: 'GIEE', titular: '-', idOrganization: orgA.id },
  })
    
  await prisma.subgerencia.deleteMany();
  const subgerA = await prisma.subgerencia.upsert({
    where: { id: '', nombre: 'Subgerencia de Sistemas Informáticos' },
    update: {},
    create: { nombre: 'Subgerencia de Sistemas Informáticos', siglas: 'SGSI', titular: 'Elisa Cabrera', idGerencia: GITE.id },
  })
  await prisma.subgerencia.upsert({
    where: { id: '', nombre: 'Subgerencia de Gobierno Digital e Innovación' },
    update: {},
    create: { nombre: 'Subgerencia de Gobierno Digital e Innovación', siglas: 'SGDI', titular: 'Mariela Campos', idGerencia: GITE.id },
  })
  await prisma.subgerencia.upsert({
    where: { id: '', nombre: 'Subgerencia de Capacitación y Formación Electoral' },
    update: {},
    create: { nombre: 'Subgerencia de Capacitación y Formación Electoral', siglas: 'SGCFE', titular: 'Carla Cueva', idGerencia: GOECOR.id },
  })       

  await prisma.userProyecto.deleteMany();
  await prisma.user.deleteMany();
  const passwordHash = await bcrypt.hash("Onpe2025", 10);
  await prisma.user.upsert({
    where: { id: '', name: 'Administrador', email:'admin@sigpro.com', password:passwordHash, phone: '' },
    update: {},
    create: { name: 'Administrador', email:'admin@sigpro.com', password:passwordHash, phone: '987000000', idRole: roleAdmin.id },
  })

  await prisma.estadoSolicitud.deleteMany();  
  await prisma.estadoSolicitud.upsert({
    where: { id: '', name: 'Registrado' },
    update: {},
    create: { value: '1', name: 'Registrado' },
  })
  await prisma.estadoSolicitud.upsert({
    where: { id: '', name: 'Estimacion' },
    update: {},
    create: { value: '2', name: 'Estimacion' },
  })
  await prisma.estadoSolicitud.upsert({
    where: { id: '', name: 'Pendiente' },
    update: {},
    create: { value: '3', name: 'Pendiente' },
  })
  await prisma.estadoSolicitud.upsert({
    where: { id: '', name: 'Aprobado' },
    update: {},
    create: { value: '4', name: 'Aprobado' },
  })
  await prisma.estadoSolicitud.upsert({
    where: { id: '', name: 'Rechazado' },
    update: {},
    create: { value: '5', name: 'Rechazado' },
  })

  await prisma.tipoRequerimiento.deleteMany();  
  await prisma.tipoRequerimiento.upsert({
    where: { id: '', name: 'PEI' },
    update: {},
    create: { value: '1', name: 'PEI' },
  })
  await prisma.tipoRequerimiento.upsert({
    where: { id: '', name: 'POE' },
    update: {},
    create: { value: '2', name: 'POE' },
  })
  await prisma.tipoRequerimiento.upsert({
    where: { id: '', name: 'POI' },
    update: {},
    create: { value: '3', name: 'POI' },
  })
  await prisma.tipoRequerimiento.upsert({
    where: { id: '', name: 'Otros' },
    update: {},
    create: { value: '4', name: 'Otros' },
  })

  await prisma.tipoProyecto.deleteMany();  
  const tipoAd = await prisma.tipoProyecto.upsert({
    where: { id: '', name: 'Administrativo' },
    update: {},
    create: { value: '1', name: 'Administrativo' },
  })
  const tipoPre = await prisma.tipoProyecto.upsert({
    where: { id: '', name: 'Pre Electoral' },
    update: {},
    create: { value: '2', name: 'Pre Electoral' },
  })
  const tipoEle = await prisma.tipoProyecto.upsert({
    where: { id: '', name: 'Electoral' },
    update: {},
    create: { value: '3', name: 'Electoral' },
  })
  const tipoPost = await prisma.tipoProyecto.upsert({
    where: { id: '', name: 'Post Electoral' },
    update: {},
    create: { value: '4', name: 'Post Electoral' },
  })

  await prisma.tipoAlcance.deleteMany();  
  await prisma.tipoAlcance.upsert({
    where: { id: '', name: 'Uso Externo' },
    update: {},
    create: { value: '1', name: 'Uso Externo' },
  })
  await prisma.tipoAlcance.upsert({
    where: { id: '', name: 'Uso Interno' },
    update: {},
    create: { value: '2', name: 'Uso Interno' },
  })

  await prisma.tipoDimension.deleteMany();  
  await prisma.tipoDimension.upsert({
    where: { id: '', name: 'Análisis y Gestión', semanas: 1 },
    update: {},
    create: { value: '1', name: 'Análisis y Gestión', semanas: 1 },
  })
  await prisma.tipoDimension.upsert({
    where: { id: '', name: 'Desacoplar Backend y Frontend', semanas: 1 },
    update: {},
    create: { value: '2', name: 'Desacoplar Backend y Frontend', semanas: 1 },
  })
  await prisma.tipoDimension.upsert({
    where: { id: '', name: 'Actualizar Versión de Software', semanas: 1 },
    update: {},
    create: { value: '3', name: 'Actualizar Versión de Software', semanas: 1 },
  })
  await prisma.tipoDimension.upsert({
    where: { id: '', name: 'Actualizar Lenguaje de Programación', semanas: 1 },
    update: {},
    create: { value: '4', name: 'Actualizar Lenguaje de Programación', semanas: 1 },
  })
  await prisma.tipoDimension.upsert({
    where: { id: '', name: 'Migrar Base de Datos', semanas: 1 },
    update: {},
    create: { value: '5', name: 'Migrar Base de Datos', semanas: 1 },
  })
  await prisma.tipoDimension.upsert({
    where: { id: '', name: 'Documentos de Gestión', semanas: 4 },
    update: {},
    create: { value: '6', name: 'Documentos de Gestión', semanas: 4 },
  })
  await prisma.tipoDimension.upsert({
    where: { id: '', name: 'Soporte', semanas: 2 },
    update: {},
    create: { value: '7', name: 'Soporte', semanas: 2 },
  })

  await prisma.estadoProyecto.deleteMany();  
  const estadoProy = await prisma.estadoProyecto.upsert({
    where: { id: '', name: 'Pendiente' },
    update: {},
    create: { value: '1', name: 'Pendiente' },
  }) 

  await prisma.tipoPresupuesto.deleteMany();  
  const tipoPresA = await prisma.tipoPresupuesto.upsert({
    where: { id: '', name: 'FUNC' },
    update: {},
    create: { value: '1', name: 'FUNC' },
  })
  const tipoPresB = await prisma.tipoPresupuesto.upsert({
    where: { id: '', name: 'PROCESO ELECTORAL' },
    update: {},
    create: { value: '2', name: 'PROCESO ELECTORAL' },
  }) 
  
  //Seccion PERIODO
  await prisma.periodo.deleteMany();  
  const per2025 = await prisma.periodo.upsert({
    where: { id: '', periodo: '2025' },
    update: {},
    create: { periodo: '2025', descripcion: 'Periodo Anual 2025', nombre: 'Año de la recuperación y consolidación de la economía peruana', idOrganization: orgA.id },
  })  
  
  //Seccion PRESUPUESTO
  await prisma.presupuesto.deleteMany();   
  const FUNC2025 = await prisma.presupuesto.upsert({
    where: { id: '', nombre: 'FUNC 2025' },
    update: {},
    create: { nombre: 'FUNC 2025', idPeriodo: per2025.id, idTipoPresupuesto: tipoPresA.id },
  })
  const ELE2025 = await prisma.presupuesto.upsert({
    where: { id: '', nombre: 'PROCESO ELECTORAL' },
    update: {},
    create: { nombre: 'PROCESO ELECTORAL', idPeriodo: per2025.id, idTipoPresupuesto: tipoPresB.id },
  })

  //Seccion PROCESOS 
  await prisma.proceso.deleteMany();  
  const CPR2025 = await prisma.proceso.upsert({
    where: { id: '', name: 'CONSULTA POPULAR DE REVOCATORIA 2025' },
    update: {},
    create: { name: 'CONSULTA POPULAR DE REVOCATORIA 2025', siglas: 'CPR 2025', idPresupuesto: ELE2025.id },
  })
  const EMC2025 = await prisma.proceso.upsert({
    where: { id: '', name: 'ELECCIONES MUNICIPALES COMPLEMENTARIAS 2025' },
    update: {},
    create: { name: 'ELECCIONES MUNICIPALES COMPLEMENTARIAS 2025', siglas: 'EMC 2025', idPresupuesto: ELE2025.id },
  })
  const EI2025 = await prisma.proceso.upsert({
    where: { id: '', name: 'ELECCIONES INTERNAS 2025' },
    update: {},
    create: { name: 'ELECCIONES INTERNAS 2025', siglas: 'EI 2025', idPresupuesto: ELE2025.id },
  })

  //Seccion USUARIOS
  const carlos = await prisma.user.upsert({
    where: { id: '', name: 'Carlos Augusto Dias Pingo', email:'g.sgsi.cadp@outlook.com', password:passwordHash, phone: '' },
    update: {},
    create: { name: 'Carlos Augusto Dias Pingo', email:'g.sgsi.cadp@outlook.com', genero:'M', password:passwordHash, phone: '931096022', idRole: roleCoord.id, idSubgerencia: subgerA.id },
  })
  const carloman = await prisma.user.upsert({
    where: { id: '', name: 'Carloman Alberto Centurion Bardales', email:'g.sgsi.carloman@outlook.com', password:passwordHash, phone: '' },
    update: {},
    create: { name: 'Carloman Alberto Centurion Bardales', email:'g.sgsi.carloman@outlook.com', genero:'M', password:passwordHash, phone: '940299306', idRole: roleFunc.id, idSubgerencia: subgerA.id },
  })
  const melissa = await prisma.user.upsert({
    where: { id: '', name: 'Halen Melissa Miraval Leon', email:'g.sgsi.hmml@outlook.com', password:passwordHash, phone: '' },
    update: {},
    create: { name: 'Halen Melissa Miraval Leon', email:'g.sgsi.hmml@outlook.com', genero:'F', password:passwordHash, phone: '997644884', idRole: roleFunc.id, idSubgerencia: subgerA.id },
  })
  const clara = await prisma.user.upsert({
    where: { id: '', name: 'Clara Carmen Vilca Retamozo', email:'g.sgsi.ccvr@outlook.com', password:passwordHash, phone: '' },
    update: {},
    create: { name: 'Clara Carmen Vilca Retamozo', email:'g.sgsi.ccvr@outlook.com', genero:'F', password:passwordHash, phone: '969753406', idRole: roleFunc.id, idSubgerencia: subgerA.id },
  })
  const fernando = await prisma.user.upsert({
    where: { id: '', name: 'Fernando Arakaki Kiyamo', email:'g.sgsi.fak@outlook.es', password:passwordHash, phone: '' },
    update: {},
    create: { name: 'Fernando Arakaki Kiyamo', email:'g.sgsi.fak@outlook.es', genero:'M', password:passwordHash, phone: '999427965', idRole: roleFunc.id, idSubgerencia: subgerA.id },
  })
  const juanjose = await prisma.user.upsert({
    where: { id: '', name: 'Juan Jose Santos Gutierrez', email:'jsantos@onpe.gob.pe', password:passwordHash, phone: '' },
    update: {},
    create: { name: 'Juan Jose Santos Gutierrez', email:'jsantos@onpe.gob.pe', genero:'M', password:passwordHash, phone: '985650002', idRole: roleFunc.id, idSubgerencia: subgerA.id },
  })
  const luisa = await prisma.user.upsert({
    where: { id: '', name: 'Luisa Oscanoa Ojeda', email:'g.sgsi.luoo@outlook.com', password:passwordHash, phone: '' },
    update: {},
    create: { name: 'Luisa Oscanoa Ojeda', email:'g.sgsi.luoo@outlook.com', genero:'F', password:passwordHash, phone: '991179809', idRole: roleFunc.id, idSubgerencia: subgerA.id },
  })
  const cecibel = await prisma.user.upsert({
    where: { id: '', name: 'Nathalie Cecibel Barrezueta Llenque', email:'nbarrezueta@onpe.gob.pe', password:passwordHash, phone: '' },
    update: {},
    create: { name: 'Nathalie Cecibel Barrezueta Llenque', email:'nbarrezueta@onpe.gob.pe', genero:'F', password:passwordHash, phone: '948166303', idRole: roleFunc.id, idSubgerencia: subgerA.id },
  })
  const ivan = await prisma.user.upsert({
    where: { id: '', name: 'Ivan Tolentino Puican', email:'ctolentino@onpe.gob.pe', password:passwordHash, phone: '' },
    update: {},
    create: { name: 'Ivan Tolentino Puican', email:'ctolentino@onpe.gob.pe', genero:'M', password:passwordHash, phone: '992752978', idRole: roleFunc.id, idSubgerencia: subgerA.id },
  })
  const liz = await prisma.user.upsert({
    where: { id: '', name: 'Liz Natalia Vidal Matos', email:'g.sgsi.lnvm@outlook.com', password:passwordHash, phone: '' },
    update: {},
    create: { name: 'Liz Natalia Vidal Matos', email:'g.sgsi.lnvm@outlook.com', genero:'F', password:passwordHash, phone: '997084062', idRole: roleFunc.id, idSubgerencia: subgerA.id },
  })
  const manuel = await prisma.user.upsert({
    where: { id: '', name: 'Manuel Rodrigo Arrisueño Gonzales', email:'g.sgsi.mrag@outlook.com', password:passwordHash, phone: '' },
    update: {},
    create: { name: 'Manuel Rodrigo Arrisueño Gonzales', email:'g.sgsi.mrag@outlook.com', genero:'M', password:passwordHash, phone: '987365422', idRole: roleFunc.id, idSubgerencia: subgerA.id },
  })
  const peter = await prisma.user.upsert({
    where: { id: '', name: 'Peter William Sandoval Meza', email:'g.sggdi.pwsm@outlook.com', password:passwordHash, phone: '' },
    update: {},
    create: { name: 'Peter William Sandoval Meza', email:'g.sggdi.pwsm@outlook.com', genero:'M', password:passwordHash, phone: '945436040', idRole: roleFunc.id, idSubgerencia: subgerA.id },
  })
  const erika = await prisma.user.upsert({
    where: { id: '', name: 'Erika Elvira Ramirez Cardenas', email:'g.sgsi.eerc@outlook.com', password:passwordHash, phone: '' },
    update: {},
    create: { name: 'Erika Elvira Ramirez Cardenas', email:'g.sgsi.eerc@outlook.com', genero:'F', password:passwordHash, phone: '992284781', idRole: roleFunc.id, idSubgerencia: subgerA.id },
  })
  const alfredo = await prisma.user.upsert({
    where: { id: '', name: 'Alfredo Sosa Dordan', email:'g.sgsi.asd@outlook.com', password:passwordHash, phone: '' },
    update: {},
    create: { name: 'Alfredo Sosa Dordan', email:'g.sgsi.asd@outlook.com', genero:'M', password:passwordHash, phone: '949795944', idRole: roleFunc.id, idSubgerencia: subgerA.id },
  })
  const rodolfo = await prisma.user.upsert({
    where: { id: '', name: 'Rodolfo Martin Atuaje Seguin', email:'g.sgsi.rmas@outlook.com', password:passwordHash, phone: '' },
    update: {},
    create: { name: 'Rodolfo Martin Atuaje Seguin', email:'g.sgsi.rmas@outlook.com', genero:'M', password:passwordHash, phone: '987115677', idRole: roleFunc.id, idSubgerencia: subgerA.id },
  })

  
    
  //Seccion PROYECTOS 
  await prisma.proyecto.deleteMany(); 
  const ONPEDUCAEI = await prisma.proyecto.upsert({
    where: { id: '', acronimo: 'ONPEDUCA EI' },
    update: {},
    create: { idGerencia: GOECOR.id, acronimo: 'ONPEDUCA EI', nombre: 'Adecuación a la Plataforma Virtual ONPEDUCA EI 2025', correlativo: 1202, codigo:'GOECOR-1202-2025-SGSI-GITE/ONPE', idTipoProyecto: tipoPre.id, idPresupuesto: ELE2025.id, idProceso: EI2025.id, idEstadoProyecto:estadoProy.id },
  })  
  const ONPEDUCA = await prisma.proyecto.upsert({
    where: { id: '', acronimo: 'ONPEDUCA' },
    update: {},
    create: { idGerencia: GOECOR.id, acronimo: 'ONPEDUCA', nombre: 'Adecuación a la Plataforma Virtual ONPEDUCA EMC 2025', correlativo: 1209, codigo:'GOECOR-1209-2025-SGSI-GITE/ONPE', idTipoProyecto: tipoPre.id, idPresupuesto: ELE2025.id, idProceso: EMC2025.id, idEstadoProyecto:estadoProy.id },
  })
  const SCM = await prisma.proyecto.upsert({
    where: { id: '', acronimo: 'SCM' },
    update: {},
    create: { idGerencia: GPP.id, acronimo: 'SCM', nombre: 'Sistema de Conformación de Mesas de Sufragio', correlativo: 1201, codigo:'GPP-1201-2025-SGSI-GITE/ONPE', idTipoProyecto: tipoPre.id, idPresupuesto: ELE2025.id, idProceso: EI2025.id, idEstadoProyecto:estadoProy.id },
  })
  const CLV = await prisma.proyecto.upsert({
    where: { id: '', acronimo: 'CLV' },
    update: {},
    create: { idGerencia: GOECOR.id, acronimo: 'CLV', nombre: 'Adecuación al sistema de Consultas de Miembros de Mesa y Local de Votación – CPR 2025', correlativo: 1208, codigo:'GOECOR-1208-2025-SGSI-GITE/ONPE', idTipoProyecto: tipoPre.id, idPresupuesto: ELE2025.id, idProceso: CPR2025.id, idEstadoProyecto:estadoProy.id },
  })
  const SIGMAEI = await prisma.proyecto.upsert({
    where: { id: '', acronimo: 'SIGMA EI2025' },
    update: {},
    create: { idGerencia: GITE.id, anulado: true, acronimo: 'SIGMA EI2025', nombre: 'Mantenimiento al Sistema de Generación de Material Electoral SIGMA-E para las Elecciones Internas 2025', correlativo: 1204, codigo:'GITE-1204-2025-SGSI-GITE/ONPE', idTipoProyecto: tipoPre.id, idPresupuesto: ELE2025.id, idProceso: EI2025.id, idEstadoProyecto:estadoProy.id, sustento: 'Sistema se pasó a producción con Solicitud de Cambio, por lo que se anula el código generado.' },
  })			
  const SIGMACPR = await prisma.proyecto.upsert({
    where: { id: '', acronimo: 'SIGMA CPR2025' },
    update: {},
    create: { idGerencia: GITE.id, acronimo: 'SIGMA CPR2025', nombre: 'Adecuación al Sistema de Generación de Material Electoral SIGMA-E en el marco de la Consulta Popular de Revocatoria del Mandato de Autoridades Municipales 2025', correlativo: 1210, codigo:'GITE-1210-2025-SGSI-GITE/ONPE', idTipoProyecto: tipoPre.id, idPresupuesto: ELE2025.id, idProceso: CPR2025.id, idEstadoProyecto:estadoProy.id },
  })
  const SCIAPCPR = await prisma.proyecto.upsert({
    where: { id: '', acronimo: 'SCIAP CPR' },
    update: {},
    create: { idGerencia: GITE.id, acronimo: 'SCIAP CPR', nombre: 'Adecuación al Sistema de Control de Impresión de Acta Padrón en el marco de la Consulta Popular de Revocatoria del Mandato de Autoridades Municipales 2025', correlativo: 1212, codigo:'GITE-1212-2025-SGSI-GITE/ONPE', idTipoProyecto: tipoPre.id, idPresupuesto: ELE2025.id, idProceso: CPR2025.id, idEstadoProyecto:estadoProy.id },
  })
  const SCIAP = await prisma.proyecto.upsert({
    where: { id: '', acronimo: 'SCIAP EI' },
    update: {},
    create: { idGerencia: GITE.id, anulado: true, acronimo: 'SCIAP', nombre: 'Adecuación del Sistema de Control de Impresión de Acta Padrón - SCIAP para las Elecciones Internas 2025', correlativo: 1205, codigo:'GITE-1205-2025-SGSI-GITE/ONPE', idTipoProyecto: tipoPre.id, idPresupuesto: ELE2025.id, idProceso: EI2025.id, idEstadoProyecto:estadoProy.id, sustento: 'Sistema se pasó a producción con Solicitud de Cambio, por lo que se anula el código generado.' },
  })
  const MATEI = await prisma.proyecto.upsert({
    where: { id: '', acronimo: 'MAT-PRUEBAS EI' },
    update: {},
    create: { idGerencia: GITE.id, anulado: true, acronimo: 'MAT-PRUEBAS EI', nombre: 'Mantenimiento del sistema de Material de Pruebas para las Elecciones Internas 2025', correlativo: 1203, codigo:'GITE-1203-2025-SGSI-GITE/ONPE', idTipoProyecto: tipoPre.id, idPresupuesto: ELE2025.id, idProceso: EI2025.id, idEstadoProyecto:estadoProy.id, sustento: 'Sistema se pasó a producción con Solicitud de Cambio, por lo que se anula el código generado.' },
  })
  const MATCPR = await prisma.proyecto.upsert({
    where: { id: '', acronimo: 'MAT-PRUEBAS CPR' },
    update: {},
    create: { idGerencia: GITE.id, acronimo: 'MAT-PRUEBAS', nombre: 'Mantenimiento del sistema de Material de Pruebas en el marco de la Consulta Popular de Revocatoria del Mandato de Autoridades Municipales 2025', correlativo: 1211, codigo:'GITE-1211-2025-SGSI-GITE/ONPE', idTipoProyecto: tipoPre.id, idPresupuesto: ELE2025.id, idProceso: CPR2025.id, idEstadoProyecto:estadoProy.id },
  })
  const SCORE = await prisma.proyecto.upsert({
    where: { id: '', acronimo: 'SCORE' },
    update: {},
    create: { idGerencia: GOECOR.id, anulado: true, acronimo: 'SCORE', nombre: 'Mantenimiento a la Suite de Cómputo de Resultados Electorales S-CORE para las Elecciones Internas 2025', correlativo: 1199, codigo:'GOECOR-1199-2025-SGSI-GITE/ONPE', idTipoProyecto: tipoEle.id, idPresupuesto: ELE2025.id, idProceso: EI2025.id, idEstadoProyecto:estadoProy.id, sustento: 'Sistema se pasó a producción con Solicitud de Cambio, por lo que se anula el código generado.' },
  })
  const SCE = await prisma.proyecto.upsert({
    where: { id: '', acronimo: 'SCE' },
    update: {},
    create: { idGerencia: GOECOR.id, acronimo: 'SCE', nombre: 'Desarrollo del Sistema de Cómputo Electoral (SCE) para el proceso de Consulta Popular de Revocatoria 2025', correlativo: 1207, codigo:'GOECOR-1207-2025-SGSI-GITE/ONPE', idTipoProyecto: tipoEle.id, idPresupuesto: ELE2025.id, idProceso: CPR2025.id, idEstadoProyecto:estadoProy.id },
  })
  const PR = await prisma.proyecto.upsert({
    where: { id: '', acronimo: 'PR' },
    update: {},
    create: { idGerencia: GIEE.id, acronimo: 'PR', nombre: 'Desarrollo del Sistema de Presentación de Resultados – CPR 2025', correlativo: 1213, codigo:'GIEE-1213-2025-SGSI-GITE/ONPE', idTipoProyecto: tipoEle.id, idPresupuesto: ELE2025.id, idProceso: CPR2025.id, idEstadoProyecto:estadoProy.id },
  })
  const SISGLOCADM = await prisma.proyecto.upsert({
    where: { id: '', acronimo: 'SIGLOC' },
    update: {},
    create: { idGerencia: GRH.id, acronimo: 'SIGLOC', nombre: 'Sistema Integrado de Gestión de Locadores de Servicios (SIGLOC)', correlativo: 1200, codigo:'GRH-1200-2025-SGSI-GITE/ONPE', idTipoProyecto: tipoAd.id, idPresupuesto: FUNC2025.id, idEstadoProyecto:estadoProy.id },
  })
  const SIGEAADM = await prisma.proyecto.upsert({
    where: { id: '', acronimo: 'SIGEA' },
    update: {},
    create: { idGerencia: GAD.id, acronimo: 'SIGEA SIGEA', nombre: 'Desarrollo evolutivo del Sistema de Gestión Electoral y Administrativa - SIGEA', correlativo: 1206, codigo:'GAD-1206-2025-SGSI-GITE/ONPE', idTipoProyecto: tipoAd.id, idEstadoProyecto:estadoProy.id },
  }) 
  /*const SISPLANPOE = await prisma.proyecto.upsert({
    where: { id: '', acronimo: 'SISPLAN POE' },
    update: {},
    create: { acronimo: 'SISPLAN POE', nombre: '-', correlativo: '', codigo:'2025', idTipoProyecto: tipoPre.id, idPresupuesto: FUNC2025.id, idEstadoProyecto:estadoProy.id },
  })
  const CLARIDAD = await prisma.proyecto.upsert({
    where: { id: '', acronimo: 'CLARIDAD' },
    update: {},
    create: { acronimo: 'CLARIDAD', nombre: '', correlativo: '', codigo:'2025', idTipoProyecto: tipoPre.id, idPresupuesto: FUNC2025.id, idEstadoProyecto:estadoProy.id },
  })
  const SISGLOC = await prisma.proyecto.upsert({
    where: { id: '', acronimo: 'SISGLOC ODPE' },
    update: {},
    create: { acronimo: 'SISGLOC ODPE', nombre: '-', correlativo: '', codigo:'2025', idTipoProyecto: tipoPre.id, idPresupuesto: FUNC2025.id, idEstadoProyecto:estadoProy.id },
  })
  const REI = await prisma.proyecto.upsert({
    where: { id: '', acronimo: 'REI' },
    update: {},
    create: { acronimo: 'REI', nombre: '-', correlativo: '', codigo:'2025', idTipoProyecto: tipoPre.id, idPresupuesto: FUNC2025.id, idEstadoProyecto:estadoProy.id },
  })
  const SISGLV = await prisma.proyecto.upsert({
    where: { id: '', acronimo: 'SISGLV' },
    update: {},
    create: { acronimo: 'SISGLV', nombre: '-', correlativo: 1234, codigo:'2025', idTipoProyecto: tipoPre.id, idPresupuesto: FUNC2025.id, idEstadoProyecto:estadoProy.id },
  })
  const ETLV = await prisma.proyecto.upsert({
    where: { id: '', acronimo: 'ETLV' },
    update: {},
    create: { acronimo: 'ETLV', nombre: '', correlativo: 1234, codigo:'2025', idTipoProyecto: tipoPre.id, idPresupuesto: FUNC2025.id, idEstadoProyecto:estadoProy.id },
  })
  const SIGEA = await prisma.proyecto.upsert({
    where: { id: '', acronimo: 'SIGEA ODPE' },
    update: {},
    create: { acronimo: 'SIGEA ODPE', nombre: '-', correlativo: 1234, codigo:'2025', idTipoProyecto: tipoPre.id, idPresupuesto: FUNC2025.id, idEstadoProyecto:estadoProy.id },
  })
  const SISGOECOR = await prisma.proyecto.upsert({
    where: { id: '', acronimo: 'SISGOECOR' },
    update: {},
    create: { acronimo: 'SISGOECOR', nombre: '-', correlativo: 1234, codigo:'2025', idTipoProyecto: tipoPre.id, idPresupuesto: FUNC2025.id, idEstadoProyecto:estadoProy.id },
  })
  const SIDEMM = await prisma.proyecto.upsert({
    where: { id: '', acronimo: 'SIDEMM' },
    update: {},
    create: { acronimo: 'SIDEMM', nombre: '-', correlativo: 1234, codigo:'2025', idTipoProyecto: tipoPre.id, idPresupuesto: FUNC2025.id, idEstadoProyecto:estadoProy.id },
  })
  const ROPC = await prisma.proyecto.upsert({
    where: { id: '', acronimo: 'ROPC' },
    update: {},
    create: { acronimo: 'ROPC', nombre: '-', correlativo: 1234, codigo:'2025', idTipoProyecto: tipoPre.id, idPresupuesto: FUNC2025.id, idEstadoProyecto:estadoProy.id },
  })
  const ERP = await prisma.proyecto.upsert({
    where: { id: '', acronimo: 'ERP-EQUIPOS' },
    update: {},
    create: { acronimo: 'ERP-EQUIPOS', nombre: '-', correlativo: 1234, codigo:'2025', idTipoProyecto: tipoPre.id, idPresupuesto: FUNC2025.id, idEstadoProyecto:estadoProy.id },
  })
  const SIDE = await prisma.proyecto.upsert({
    where: { id: '', acronimo: 'SIDE' },
    update: {},
    create: { acronimo: 'SIDE', nombre: '-', correlativo: 1234, codigo:'2025', idTipoProyecto: tipoEle.id, idPresupuesto: FUNC2025.id, idEstadoProyecto:estadoProy.id },
  })
  const CEMM = await prisma.proyecto.upsert({
    where: { id: '', acronimo: 'CEMM' },
    update: {},
    create: { acronimo: 'CEMM', nombre: '-', correlativo: 1234, codigo:'2025', idTipoProyecto: tipoPost.id, idPresupuesto: FUNC2025.id, idEstadoProyecto:estadoProy.id },
  })
  const GEMMA = await prisma.proyecto.upsert({
    where: { id: '', acronimo: 'GEMMA' },
    update: {},
    create: { acronimo: 'GEMMA', nombre: '-', correlativo: 1234, codigo:'2025', idTipoProyecto: tipoPost.id, idPresupuesto: FUNC2025.id, idEstadoProyecto:estadoProy.id },
  })
  const SARHA = await prisma.proyecto.upsert({
    where: { id: '', acronimo: 'SARHA' },
    update: {},
    create: { acronimo: 'SARHA', nombre: '-', correlativo: 1234, codigo:'2025', idTipoProyecto: tipoAd.id, idPresupuesto: FUNC2025.id, idEstadoProyecto:estadoProy.id },
  })
  const SIGAP = await prisma.proyecto.upsert({
    where: { id: '', acronimo: 'SIGAP' },
    update: {},
    create: { acronimo: 'SIGAP', nombre: '-', correlativo: 1234, codigo:'2025', idTipoProyecto: tipoAd.id, idPresupuesto: FUNC2025.id, idEstadoProyecto:estadoProy.id },
  })
  const SASA = await prisma.proyecto.upsert({
    where: { id: '', acronimo: 'SASA' },
    update: {},
    create: { acronimo: 'SASA', nombre: '-', correlativo: 1234, codigo:'2025', idTipoProyecto: tipoAd.id, idPresupuesto: FUNC2025.id, idEstadoProyecto:estadoProy.id },
  })  	
  const SISPLAN = await prisma.proyecto.upsert({
    where: { id: '', acronimo: 'SISPLAN POI' },
    update: {},
    create: { acronimo: 'SISPLAN POI', nombre: '-', correlativo: 1234, codigo:'2025', idTipoProyecto: tipoAd.id, idPresupuesto: FUNC2025.id, idEstadoProyecto:estadoProy.id },
  }) 
  const SGD = await prisma.proyecto.upsert({
    where: { id: '', acronimo: 'SGD' },
    update: {},
    create: { acronimo: 'SGD', nombre: 'SISTEMA DE GESTIÓN DOCUMENTAL', correlativo: 1234, codigo:'2025', idTipoProyecto: tipoAd.id, idPresupuesto: FUNC2025.id, idEstadoProyecto:estadoProy.id },
  })
  const MPVE = await prisma.proyecto.upsert({
    where: { id: '', acronimo: 'MPVE' },
    update: {},
    create: { acronimo: 'MPVE', nombre: '-', correlativo: 1234, codigo:'2025', idTipoProyecto: tipoAd.id, idPresupuesto: FUNC2025.id, idEstadoProyecto:estadoProy.id },
  })
  const SSVE = await prisma.proyecto.upsert({
    where: { id: '', acronimo: 'SSVE' },
    update: {},
    create: { acronimo: 'SSVE', nombre: '-', correlativo: 1234, codigo:'2025', idTipoProyecto: tipoAd.id, idPresupuesto: FUNC2025.id, idEstadoProyecto:estadoProy.id },
  })*/

  //ASIGNACIONES  
  /*await prisma.userProyecto.upsert({
    where: { id: '', cargo: '', idUser: carloman.id, idProyecto: REI.id },
    update: {},
    create: { cargo: 'Coordinador', idUser: carloman.id, idProyecto: REI.id },
  })
  await prisma.userProyecto.upsert({
    where: { id: '', cargo: '', idUser: carloman.id, idProyecto: SISGLV.id },
    update: {},
    create: { cargo: 'Coordinador', idUser: carloman.id, idProyecto: SISGLV.id },
  })
  await prisma.userProyecto.upsert({
    where: { id: '', cargo: '', idUser: carloman.id, idProyecto: ETLV.id },
    update: {},
    create: { cargo: 'Coordinador', idUser: carloman.id, idProyecto: ETLV.id },
  })
  await prisma.userProyecto.upsert({
    where: { id: '', cargo: '', idUser: carloman.id, idProyecto: SISGOECOR.id },
    update: {},
    create: { cargo: 'Coordinador', idUser: carloman.id, idProyecto: SISGOECOR.id },
  })
  await prisma.userProyecto.upsert({
    where: { id: '', cargo: '', idUser: carloman.id, idProyecto: CEMM.id },
    update: {},
    create: { cargo: 'Coordinador', idUser: carloman.id, idProyecto: CEMM.id },
  })
  await prisma.userProyecto.upsert({
    where: { id: '', cargo: '', idUser: carloman.id, idProyecto: SASA.id },
    update: {},
    create: { cargo: 'Coordinador', idUser: carloman.id, idProyecto: SASA.id },
  })*/
  await prisma.userProyecto.upsert({
    where: { id: '', cargo: '', idUser: carloman.id, idProyecto: CLV.id },
    update: {},
    create: { cargo: 'Coordinador', idUser: carloman.id, idProyecto: CLV.id },
  })
  await prisma.userProyecto.upsert({
    where: { id: '', cargo: '', idUser: carloman.id, idProyecto: PR.id },
    update: {},
    create: { cargo: 'Coordinador', idUser: carloman.id, idProyecto: PR.id },
  })
  

  await prisma.userProyecto.upsert({
    where: { id: '', cargo: '', idUser: melissa.id, idProyecto: SCM.id },
    update: {},
    create: { cargo: 'Coordinador', idUser: melissa.id, idProyecto: SCM.id },
  })
  /*await prisma.userProyecto.upsert({
    where: { id: '', cargo: '', idUser: melissa.id, idProyecto: SIDEMM.id },
    update: {},
    create: { cargo: 'Coordinador', idUser: melissa.id, idProyecto: SIDEMM.id },
  })

  await prisma.userProyecto.upsert({
    where: { id: '', cargo: '', idUser: clara.id, idProyecto: SISPLANPOE.id },
    update: {},
    create: { cargo: 'Coordinador', idUser: clara.id, idProyecto: SISPLANPOE.id },
  })
  await prisma.userProyecto.upsert({
    where: { id: '', cargo: '', idUser: clara.id, idProyecto: SIGEA.id },
    update: {},
    create: { cargo: 'Coordinador', idUser: clara.id, idProyecto: SIGEA.id },
  })
  await prisma.userProyecto.upsert({
    where: { id: '', cargo: '', idUser: clara.id, idProyecto: SISPLAN.id },
    update: {},
    create: { cargo: 'Coordinador', idUser: clara.id, idProyecto: SISPLAN.id },
  })*/
  await prisma.userProyecto.upsert({
    where: { id: '', cargo: '', idUser: clara.id, idProyecto: SIGEAADM.id },
    update: {},
    create: { cargo: 'Coordinador', idUser: clara.id, idProyecto: SIGEAADM.id },
  })  

  await prisma.userProyecto.upsert({
    where: { id: '', cargo: '', idUser: fernando.id, idProyecto: SIGMACPR.id },
    update: {},
    create: { cargo: 'Coordinador', idUser: fernando.id, idProyecto: SIGMACPR.id },
  })
  await prisma.userProyecto.upsert({
    where: { id: '', cargo: '', idUser: fernando.id, idProyecto: SCIAPCPR.id },
    update: {},
    create: { cargo: 'Coordinador', idUser: fernando.id, idProyecto: SCIAPCPR.id },
  })
  await prisma.userProyecto.upsert({
    where: { id: '', cargo: '', idUser: fernando.id, idProyecto: SCIAP.id },
    update: {},
    create: { cargo: 'Coordinador', idUser: fernando.id, idProyecto: SCIAP.id },
  })
  await prisma.userProyecto.upsert({
    where: { id: '', cargo: '', idUser: fernando.id, idProyecto: MATCPR.id },
    update: {},
    create: { cargo: 'Coordinador', idUser: fernando.id, idProyecto: MATCPR.id },
  })  
  /*await prisma.userProyecto.upsert({
    where: { id: '', cargo: '', idUser: fernando.id, idProyecto: ERP.id },
    update: {},
    create: { cargo: 'Coordinador', idUser: fernando.id, idProyecto: ERP.id },
  })
  await prisma.userProyecto.upsert({
    where: { id: '', cargo: '', idUser: fernando.id, idProyecto: SIDE.id },
    update: {},
    create: { cargo: 'Coordinador', idUser: fernando.id, idProyecto: SIDE.id },
  })*/

  await prisma.userProyecto.upsert({
    where: { id: '', cargo: '', idUser: juanjose.id, idProyecto: SCE.id },
    update: {},
    create: { cargo: 'Coordinador', idUser: juanjose.id, idProyecto: SCE.id },
  })

  await prisma.userProyecto.upsert({
    where: { id: '', cargo: '', idUser: luisa.id, idProyecto: SIGMAEI.id },
    update: {},
    create: { cargo: 'Coordinador', idUser: luisa.id, idProyecto: SIGMAEI.id },
  })
  await prisma.userProyecto.upsert({
    where: { id: '', cargo: '', idUser: luisa.id, idProyecto: MATEI.id },
    update: {},
    create: { cargo: 'Coordinador', idUser: luisa.id, idProyecto: MATEI.id },
  })
  await prisma.userProyecto.upsert({
    where: { id: '', cargo: '', idUser: luisa.id, idProyecto: SCE.id },
    update: {},
    create: { cargo: 'Coordinador', idUser: luisa.id, idProyecto: SCE.id },
  })

  /*await prisma.userProyecto.upsert({
    where: { id: '', cargo: '', idUser: cecibel.id, idProyecto: SARHA.id },
    update: {},
    create: { cargo: 'Coordinador', idUser: cecibel.id, idProyecto: SARHA.id },
  })
  await prisma.userProyecto.upsert({
    where: { id: '', cargo: '', idUser: cecibel.id, idProyecto: SISGLOC.id },
    update: {},
    create: { cargo: 'Coordinador', idUser: cecibel.id, idProyecto: SISGLOC.id },
  })*/  
  await prisma.userProyecto.upsert({
    where: { id: '', cargo: '', idUser: cecibel.id, idProyecto: SISGLOCADM.id },
    update: {},
    create: { cargo: 'Coordinador', idUser: cecibel.id, idProyecto: SISGLOCADM.id },
  })
  

  await prisma.userProyecto.upsert({
    where: { id: '', cargo: '', idUser: ivan.id, idProyecto: ONPEDUCAEI.id },
    update: {},
    create: { cargo: 'Coordinador', idUser: ivan.id, idProyecto: ONPEDUCAEI.id },
  })
  await prisma.userProyecto.upsert({
    where: { id: '', cargo: '', idUser: ivan.id, idProyecto: ONPEDUCA.id },
    update: {},
    create: { cargo: 'Coordinador', idUser: ivan.id, idProyecto: ONPEDUCA.id },
  })

  /*await prisma.userProyecto.upsert({
    where: { id: '', cargo: '', idUser: liz.id, idProyecto: SIGAP.id },
    update: {},
    create: { cargo: 'Coordinador', idUser: liz.id, idProyecto: SIGAP.id },
  })
  await prisma.userProyecto.upsert({
    where: { id: '', cargo: '', idUser: liz.id, idProyecto: ROPC.id },
    update: {},
    create: { cargo: 'Coordinador', idUser: liz.id, idProyecto: ROPC.id },
  })

  await prisma.userProyecto.upsert({
    where: { id: '', cargo: '', idUser: manuel.id, idProyecto: GEMMA.id },
    update: {},
    create: { cargo: 'Coordinador', idUser: manuel.id, idProyecto: GEMMA.id },
  })*/
  await prisma.userProyecto.upsert({
    where: { id: '', cargo: '', idUser: manuel.id, idProyecto: SCORE.id },
    update: {},
    create: { cargo: 'Coordinador', idUser: manuel.id, idProyecto: SCORE.id },
  })
  

  await prisma.userProyecto.upsert({
    where: { id: '', cargo: '', idUser: alfredo.id, idProyecto: SIGEAADM.id },
    update: {},
    create: { cargo: 'Coordinador', idUser: alfredo.id, idProyecto: SIGEAADM.id },
  })

  /*await prisma.userProyecto.upsert({
    where: { id: '', cargo: '', idUser: rodolfo.id, idProyecto: REI.id },
    update: {},
    create: { cargo: 'Coordinador', idUser: rodolfo.id, idProyecto: REI.id },
  })

  await prisma.userProyecto.upsert({
    where: { id: '', cargo: '', idUser: peter.id, idProyecto: CLARIDAD.id },
    update: {},
    create: { cargo: 'Coordinador', idUser: peter.id, idProyecto: CLARIDAD.id },
  })

  await prisma.userProyecto.upsert({
    where: { id: '', cargo: '', idUser: erika.id, idProyecto: SGD.id },
    update: {},
    create: { cargo: 'Coordinador', idUser: erika.id, idProyecto: SGD.id },
  })
  await prisma.userProyecto.upsert({
    where: { id: '', cargo: '', idUser: erika.id, idProyecto: MPVE.id },
    update: {},
    create: { cargo: 'Coordinador', idUser: erika.id, idProyecto: MPVE.id },
  })
  await prisma.userProyecto.upsert({
    where: { id: '', cargo: '', idUser: erika.id, idProyecto: SSVE.id },
    update: {},
    create: { cargo: 'Coordinador', idUser: erika.id, idProyecto: SSVE.id },
  })*/

  console.log("Se ha ejecutado correctamente.")
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })