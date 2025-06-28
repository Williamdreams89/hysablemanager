import { Box, Button, Card, Divider, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import '@mantine/core/styles.css';
import {Autocomplete, FileInput, MantineProvider, NativeSelect, TextInput} from "@mantine/core"
import { SimpleGrid } from '@mantine/core';
import useMediaQuery from '@mui/material/useMediaQuery';
import React from 'react'
import { GridMenuIcon } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';



const StudentAddForm = () => {
  const isSmallDevice =useMediaQuery('(max-width:1025px)')
  const navigate = useNavigate()
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px', position:'relative' } }}>
        <Box sx={{display:'flex', flexDirection: isSmallDevice ? 'column-reverse':'row',mt:'1rem', mb:'2rem',justifyContent:'space-between',alignItems:!isSmallDevice?'center':null, width:'100%', gap:'2rem'}}>
            <Typography variant={ !isSmallDevice?'h4':'h5'} component={'h3'}>Student Admission Form</Typography>
            <Box sx={isSmallDevice ?{width:'100%', display:'flex', justifyContent:'end'}:null}>
              <Button variant='contained' onClick={()=>navigate("/people/students")} size={isSmallDevice?'large':'large'} sx={{width:'fit-content'}}><GridMenuIcon sx={{mr:'.5rem'}} /> View Students</Button>            
            </Box>
        </Box>
        <Card>
        <MantineProvider>
          <Typography variant='h6' component={'h4'}>Student Information</Typography>
        <Divider sx={{mb:'1rem', mt:'1rem'}} />
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 4 }}
          spacing={{ base: 10, sm: 'xl' }}
          verticalSpacing={{ base: 'md', sm: 'xl' }}
        >
        <TextInput
          label="First Name"
          required
        />
        <TextInput
          label="Last Name"
          required
        />
        <NativeSelect
          label="Class"
          data={['','KG1', 'KG2','BS1','BS2','BS3','BS4','BS5','BS6', 'JHS1', 'JHS2', 'JHS3']}
          required
        />
        <NativeSelect
          label="Section"
          data={['','A', 'B', 'C']}
          required
        />
          <NativeSelect label='Gender' data={['', 'Male', 'Female']} />
          <TextInput type='date'  label='Date of Birth' />
          <TextInput label='Auto Registration Number' />
          <TextInput label='Admission No.' />
          <TextInput type='date' label='Admission Date' />
          <NativeSelect label='Religion' data={['', 'Christianity', 'Islam', 'Traditional']} />
          <TextInput type='email'  label='Email' />
          <FileInput accept="image/png,image/jpeg" label="Upload Student Profile Photo" placeholder='No file chosen' />
        </SimpleGrid>
        <Typography variant='h6' component={'h4'} sx={{mt:'2rem'}}>Parent Information</Typography>
        <Divider sx={{mb:'1rem', mt:'1rem'}} />
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 4 }}
          spacing={{ base: 10, sm: 'xl' }}
          verticalSpacing={{ base: 'md', sm: 'xl' }}
        >
          <TextInput label='Father Name' />
          <TextInput label='Mother Name' />
          <TextInput label='Father Occupation' />
          <TextInput label='Mother Occupation' />
          <TextInput label='Parent Contact' />
          <TextInput type='tel' label='Parent Contact' />
          <TextInput label='Nationality' />
          <TextInput label='Area of Residence' />
          <TextInput label='GPS Address' />
          <FileInput accept="image/png,image/jpeg" label="Upload Parent Photo" placeholder='No file chosen' />
        </SimpleGrid>
        <Box sx={{mt:'2rem', display:'flex', gap:'1rem'}}>
          <Button variant='contained' size='large'>Save</Button>
          <Button variant='contained' size='large' color='error'>Reset</Button>
        </Box>
        </MantineProvider>
        </Card>
    </Box>
  )
}

export default StudentAddForm