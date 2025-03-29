
import SkillCard from '@/app/admin/manage-skills/elements/SkillCard';
import { skillsSelector } from '@/store/features/questions/selectors';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useSelector } from 'react-redux';

const Skills = () => {
    const skills = useSelector(skillsSelector);

    return (
        <div className='mt-4 bg-newCodes-foreground p-6'>
            {skills?.length == 0 ? (
                <div className="text-center text-gray-500">
                    <h3 className="text-lg font-semibold">No Skills Available</h3>
                    <p className="mt-2">Please add some skills to get started.</p>
                </div>
            ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                    {skills?.map((item, index) => (
                        <div key={item?.id}>
                            <SkillCard
                                id={item?.skillId}
                                title={item?.name || item?.skillName}
                                onEdit={() => handleOpenDialog(index)}  // Passing the edit handler
                                onDelete={() => handleOpenDeleteDialog(index)}  // Passing the delete handler
                                hasActions={false}
                                levels={item?.levels}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Skills;
