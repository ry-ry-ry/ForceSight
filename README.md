# Introduction

ForceSight is an in-development web program to manage military units along with their deployments, rotation status and timeline, missions, operations, bases, and unit structure.

ForceSight is originally developed for private simulated use, but as an open source program might serve OSINT sources well for use as an organised unit and deployment tracking tool.

At the moment, ForceSight does not come with any unit, operations, or deployment data by default. That might change in the future.

# Features

## Dashboard

### Dashboard Metrics

- Total Units in Database
- Number of Deployed Units
- Number of units on Standby
- Number of units Training
- Number of Units on Active Operations

### Rotation Status

- NATO Symbol
- Unit Patch
- Unit Name
- Assigned Operation
- Unit Echelon / Size
- Number of Days Deployed
- Threshold (rotation threshold)
- Status / Rotation Tracking
- Rotation Priority
- Sorted by Priority, Then Number of Days Deployed

  ### Recent Units

  - Unit Patch, Name, Echelon, Status
  - Status Overview (Same as Dashboard Metrics atm)

## Units

### Add Unit

- Unit Name
- Unit Type [Base, Command, Ground, Air, SOF, Support]
- Country
- Status [Standby, Deployed, Training, Reset]
- Health
- Effectiveness [0-100%]
- Home Base
- Parent Unit
- Last RTB Date
- Unit Patch [Photo Upload]
- NATO Symbol

<img width="1378" height="1585" alt="image" src="https://github.com/user-attachments/assets/3d38c8ed-9aab-4f2d-9da4-f52ada6fd5f4" />

### Unit Roster & Search

**Search**

- Search Unit [Text search]
- Sort [Alphabetical, Status, Echelon, Recently Created]
- Filter by Country
- Filter by Echelon / Unit Size
- Filter by Active Operation
- Filter by Health
- Filter by Effectiveness

**Roster**

Displays units within the filter critiera, or all units if no filter.

- Unit Patch
- Unit Echelon
- Unit Country
- Unit Status
- Collapsible Subordinates

  <img width="472" height="1550" alt="image" src="https://github.com/user-attachments/assets/c36bfedf-0070-45f4-94f2-f674a608f7a8" />

  ### Unit View

  - Unit Name
  - Unit Type
  - Unit Echelon / Size
  - Unit Status
  - Unit Health
  - Unit Effectiveness
  - Unit Patch
  - Edit Unit
  - Deployment List
  - Missions List
  - Map / Unit Location
  - Operational Status
  - Deployment Metrics
  - Task Force Assignment
  - Add Subordinate Unit
  - Chain of Command
  - Subordinate Units
  - Generate Hierarchy Image
 
    <img width="1366" height="1773" alt="image" src="https://github.com/user-attachments/assets/dfa0b3ce-fbb6-4b70-a186-41ce71acf4db" />

    ## Operations
 
    ### Operations Filtering

    - Search Operations [Text Search]
    - Status Filter [Planning, Active, Completed Suspended]
    - Hide Completed
    - Clear Filters
   
    ### Operations List

    - Operation Name
    - Operation Type
    - Operation Status
    - Edit
    - Delete
    - Start Date
    - End Date
    - Add Task Force to Operation
    - Assigned Units [NATO Symbol, Unit Patch, Name, Echelon]
    - Create Unassigned Task Force
   
      <img width="1285" height="882" alt="image" src="https://github.com/user-attachments/assets/6f1c8f56-3d40-4b87-8d75-61d874b0c73a" />

      ### New Operation

      - Operation Name
      - Operation Type [Campaign, Tactical, Training, Humanitarian, Other]
      - Operation Status [Planning, Active, Completed, Suspended]
      - Operation Description
      - Start Date
      - End Date
     
        <img width="1270" height="723" alt="image" src="https://github.com/user-attachments/assets/40f69452-992a-4b36-8301-59a39a4b5003" />

      ### New Task Force

        - Task Force Name
        - Task Force Description
        - Assigned Units

        <img width="1287" height="1258" alt="image" src="https://github.com/user-attachments/assets/6d620473-efc6-48d5-be81-e1b32828fe22" />

      ## Map

      ### Map Controls

      - Dark/Light Mode
      - Terrain
      - 3D Buildings
      - Show Unit Locations
      - Show Custom Pins
      - Import Map Data [KML / KMZ  SHAPEFILE / JSON]
      - Export Map Data [JSON]
      - Show Custom Shapes

        <img width="1419" height="1201" alt="image" src="https://github.com/user-attachments/assets/d5dd5fb4-d8b0-4558-b5b8-c46abfa4bbf4" />

        ### Map 3D Preview

        <img width="1420" height="1686" alt="image" src="https://github.com/user-attachments/assets/8ff3cda7-b548-43ce-bd87-6df1c126dcd3" />

        ## Admin Panel

        ### Echelon Management

        - Override Included Echelons by Country
       
          <img width="1403" height="994" alt="image" src="https://github.com/user-attachments/assets/9fc47fc7-6c78-45d5-b05f-eb055981e290" />

          ## Settings

          - Theme [Army, Cyber]
          - Backup Database [JSON, SQLite/MySQL]
          - Import from Backup
          - Database Information
          - Version and Software Information

          <img width="840" height="1279" alt="image" src="https://github.com/user-attachments/assets/0a98b877-3d16-43ac-892a-513f42c07f05" />


