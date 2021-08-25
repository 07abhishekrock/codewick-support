import React from 'react'
import GeneralList from './GeneralList'

const projects_list = [
    {
        projectName : 'Pysurance',
        projectSubject : 'Python based insurance website with django backend.',
        projectId : '1234',
        totalFeatures : 34,
        totalBugs : 12,
    },
    {
        projectName : 'Codewick Common',
        projectSubject : 'Common work of all projects.',
        projectId : '1235',
        totalFeatures : 35,
        totalBugs : 22,
    }
]

function ProjectsListWrapper() {
    return (
        <GeneralList>
            {}
        </GeneralList>
    )
}
