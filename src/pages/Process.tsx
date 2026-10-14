import { useEffect, useState } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { ProcessCard } from "../components/ProcessCard";
import { supabase } from "../supabaseClient"; // Ajusta la ruta a tu cliente de Supabase

interface Engineer {
  id: number;
  name: string;
}

interface ProcessItem {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  engineers: Engineer[];
}

export const Process = () => {
  const [processes, setProcesses] = useState<ProcessItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProcesses = async () => {
    try {
      setLoading(true);

      // 1. Obtenemos los procesos básicos de 'process_types'
      const { data: dbProcesses, error: procError } = await supabase
        .from("process_types")
        .select("id, name, description, image");

      if (procError) throw procError;

      // 2. Obtenemos las asignaciones de la tabla intermedia 'users_processes' de forma plana
      const { data: dbAsignaciones, error: assignError } = await supabase.from(
        "users_processes",
      ).select(`
          process_id,
          user_id
        `);

      if (assignError) throw assignError;

      // 3. Obtenemos la lista de usuarios (ingenieros) para mapear sus nombres
      const { data: dbUsers, error: usersError } = await supabase
        .from("users")
        .select("id, name");

      if (usersError) throw usersError;

      if (dbProcesses) {
        // Estructuramos y combinamos los datos en el cliente de forma segura
        const formattedProcesses = dbProcesses.map((proc) => {
          // Resolver imagen local en /src/assets/process/
          // eslint-disable-next-line no-useless-assignment
          let finalImgUrl = "";
          try {
            finalImgUrl = new URL(
              `../assets/process/${proc.image}.webp`,
              import.meta.url,
            ).href;
          } catch (error) {
            console.error(
              "Error al resolver la URL de la imagen local:",
              error,
            );
            finalImgUrl =
              "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600";
          }

          // Filtrar qué IDs de usuario están asignados a este proceso
          const idsAsignados =
            dbAsignaciones
              ?.filter((asig) => asig.process_id === proc.id)
              .map((asig) => asig.user_id) || [];

          // Cruzar los IDs con los nombres reales de la tabla 'users'
          const assignedEngineers: Engineer[] = (dbUsers || [])
            .filter((user) => idsAsignados.includes(user.id))
            .map((user) => ({
              id: user.id,
              name: user.name,
            }));

          return {
            id: proc.id,
            name: proc.name,
            description: proc.description,
            imageUrl: finalImgUrl,
            engineers: assignedEngineers,
          };
        });

        setProcesses(formattedProcesses);
      }
    } catch (error) {
      const err = error as Error;
      console.error("Error al obtener los procesos SMT:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProcesses();
  }, []);

  return (
    <Container className="mt-4">
      <div className="mb-4">
        <h2>Procesos SMT</h2>
        <p className="text-muted">
          Línea de producción y personal de ingeniería a cargo de cada etapa
          obtenidos en tiempo real.
        </p>
      </div>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" role="status">
            <span className="visually-hidden">Cargando procesos...</span>
          </Spinner>
        </div>
      ) : processes.length === 0 ? (
        <div className="text-center my-5 text-muted">
          No se encontraron procesos registrados en la base de datos.
        </div>
      ) : (
        <Row className="g-4">
          {processes.map((proceso) => (
            <Col key={proceso.id} xs={12} sm={6} md={4} lg={3}>
              <ProcessCard
                id={proceso.id}
                name={proceso.name}
                description={proceso.description}
                imageUrl={proceso.imageUrl}
                engineers={proceso.engineers}
              />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};
