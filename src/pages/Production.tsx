import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { getProductionJobs, updateProductionStage } from '../api/services';
import { type ProductionJob, type ProductionStage } from '../api/db';
import { Box, Ruler, Scissors, CheckCircle2 } from 'lucide-react';

const STAGES: { id: ProductionStage; label: string; icon: any; color: string }[] = [
  { id: 'PROCUREMENT', label: 'Procurement', icon: Box, color: 'text-amber-600' },
  { id: 'MEASUREMENT', label: 'Measurement Final', icon: Ruler, color: 'text-blue-600' },
  { id: 'TAILORING', label: 'Tailoring/Stitching', icon: Scissors, color: 'text-purple-600' },
  { id: 'READY', label: 'Ready for Dispatch', icon: CheckCircle2, color: 'text-[#10b981]' },
];

export function Production() {
  const [jobs, setJobs] = useState<ProductionJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    const data = await getProductionJobs();
    setJobs(data);
    setLoading(false);
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId) return;

    const newStage = destination.droppableId as ProductionStage;
    
    // Optimistic update
    setJobs(prev => 
      prev.map(j => j.id === draggableId ? { ...j, stage: newStage } : j)
    );

    // Actual API call
    await updateProductionStage(draggableId, newStage);
  };

  const JobCard = ({ job }: { job: ProductionJob }) => (
    <div className="bg-card border border-border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow mb-3 cursor-grab active:cursor-grabbing">
      <div className="flex justify-between items-start mb-3">
        <span className="px-2 py-0.5 font-medium text-[10px] uppercase bg-secondary text-muted rounded">
          {job.id}
        </span>
        {job.assigneeName && (
          <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]" title={job.assigneeName}>
            {job.assigneeName.charAt(0)}
          </div>
        )}
      </div>
      <h4 className="font-semibold text-foreground text-sm line-clamp-2">{job.projectName}</h4>
    </div>
  );

  return (
    <div className="space-y-6 flex flex-col h-full relative pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-primary">Production Floor</h1>
          <p className="text-sm text-muted mt-1">Track manufacturing and dispatch progress</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-muted">Loading production jobs...</div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex overflow-x-auto xl:grid xl:grid-cols-4 gap-6 pb-4 flex-1 items-start h-[calc(100vh-200px)] snap-x">
            {STAGES.map(column => {
              const Icon = column.icon;
              return (
                <div key={column.id} className="bg-secondary/30 rounded-xl p-4 flex flex-col max-h-full border border-border/50 min-w-[280px] w-[85vw] xl:w-auto snap-center shrink-0">
                  <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${column.color}`} />
                      {column.label}
                    </h3>
                    <span className="bg-background text-muted text-xs font-bold px-2 py-1 rounded-full shadow-sm border border-border">
                      {jobs.filter(j => j.stage === column.id).length}
                    </span>
                  </div>
                  
                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div 
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 overflow-y-auto transition-colors rounded-lg p-1 min-h-[200px] ${snapshot.isDraggingOver ? 'bg-secondary/50' : ''}`}
                      >
                        {jobs.filter(j => j.stage === column.id).map((job, index) => (
                          <Draggable key={job.id} draggableId={job.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{ ...provided.draggableProps.style }}
                                className={snapshot.isDragging ? 'opacity-80' : ''}
                              >
                                <JobCard job={job} />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      )}
    </div>
  );
}
