import { useState } from 'react'
import { Box, Text, IconButton, Card, Flex, TextField, Button, Link} from '@radix-ui/themes'
import { TrashIcon } from '@radix-ui/react-icons';  
import { getYouTubeThumbnail } from '@/utils/getYoutubeThumbnail';

interface LinksCardProps {
  link: string;
  workoutTitle: string;
  activityText: string;
  onAdd: (title: string, activityDescription: string) => void;
  onDelete: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function LinksCard({link, workoutTitle, activityText, onAdd, onDelete}: LinksCardProps){
  const [isEditing, setIsEditing] = useState(!workoutTitle); 
  const [inputValue, setInputValue] = useState(workoutTitle);
  const [activityDescription, setActivityDescription] = useState(activityText);
  
  const handleSubmit = () => {
    if (!inputValue.trim() || !activityDescription.trim()) return; 
    onAdd(inputValue, activityDescription);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setInputValue(workoutTitle);
    setIsEditing(false);
  };
  

  const thumbnail = getYouTubeThumbnail(link);

  return(
    <Box maxWidth="500px">
      <Card size="5" style={{height: "500px", position: "relative"}}>
        <IconButton 
          variant="solid"  
          color="red"
          onClick={onDelete}
          style={{position: "absolute", top: "12px", right: "12px"}}
        >
          <TrashIcon />
        </IconButton>
        
        <Flex gap="3" align="center">	
          <Box style={{width: "100%"}}>
            {!isEditing ? (
              <>
                <Text 
                  as="div"
                  size="5"
                  weight="bold"
                  style={{marginBottom: "5px", cursor: "pointer"}}
                  onClick={() => setIsEditing(true)}
                >
                  {workoutTitle.toUpperCase() || "Untitled Workout"}	
                </Text>

                <Text
                  as="div"
                  size="2"
                  weight="bold"
                >
                Activity Description:
                </Text>

                <Text
                  as="div"
                  size="2"
                  weight="regular"
                  style={{marginBottom: "5px", cursor: "pointer"}}
                  onClick={() => setIsEditing(true)}
                >
                    {activityText || "Untitled Activity"}
                </Text>
                
                <Text
                  as="div"
                  size="2"
                  weight="bold"
                >
                Url:
                </Text>

                <Link
                  href={link}
                  size="2"
                  weight="regular"
                  style={{marginBottom: "5px", cursor: "pointer"}}
                  >
                    {link}
                </Link>
              </>
            ) : (
              <Flex gap="2" direction="column" style={{marginBottom: "50px"}}>
                <TextField.Root 
                  value={inputValue}
                  size="2" 
                  placeholder="Title your workout"
                  onChange={(e) => setInputValue(e.target.value)}
                  autoFocus
                /> 
                
                <TextField.Root 
                  value={activityDescription}
                  size="2"
                  placeholder="Activity Description"
                  onChange={(e) => setActivityDescription(e.target.value)}
                  autoFocus
                />

                <Flex gap="2">
                  <Button type="button" onClick={handleSubmit}>
                    Save
                  </Button>
                  <Button type="button" variant="soft" onClick={handleCancel}>
                    Cancel
                  </Button>

                </Flex>

              </Flex>
            )}
              
            {thumbnail && (
              <a href={link}>
                <img 
                  src={thumbnail} 
                  alt="Video thumbnail"
                  style={{width: "100%", borderRadius: "8px", marginTop: "20px"}}
                />
              </a>
            )}  
          </Box>
        </Flex>
      </Card>
    </Box>
  )
}
