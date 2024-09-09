import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';

const ProgressBar = ({ current, goals }) => {
    if (!goals || goals.length === 0) {
        return <Typography variant="body2">Nenhuma meta definida.</Typography>;
    }

    // Ordena as metas por valor
    const sortedGoals = goals.sort((a, b) => (a.valor || 0) - (b.valor || 0));

    // Encontra a meta atual e a meta anterior
    const currentGoalIndex = sortedGoals.findIndex(goal => (goal.valor || 0) >= current);
    const currentGoal = sortedGoals[currentGoalIndex] || sortedGoals[sortedGoals.length - 1];
    const previousGoal = sortedGoals[currentGoalIndex - 1] || { valor: 0 };

    const progress = ((current / currentGoal.valor) * 100);
    // console.log('teste', teste);
    


    // Depuração: imprime os valores
    console.log('Current Value:', current);
    console.log('Previous Goal:', previousGoal.valor);
    console.log('Current Goal:', currentGoal.valor);

    // Calcula o intervalo e o progresso
    const range = currentGoal.valor - previousGoal.valor;
    // const progress = range > 0 ? ((current - previousGoal.valor) / range) * 100 : 0;
    const clampedProgress = Math.min(Math.max(progress, 0), 100);
    console.log('range', range)
    // Depuração: imprime o progresso
    console.log('Calculated Progress:', progress);
    console.log('Clamped Progress:', clampedProgress);

    return (
        <Box sx={{ pl: 5, pr: 5, mb: 2, overflow: 'hidden' }}>
            <Typography variant="body2">
                Próxima Meta: {currentGoal.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </Typography>
            <Box sx={{ position: 'relative', height: 40, width: '100%' }}>
                <LinearProgress
                    variant="determinate"
                    value={clampedProgress} // Usa o progresso clamped
                    sx={{ width: '100%', height: 10, borderRadius: 5 }}
                />
                {sortedGoals.map((goal) => (
                    <Box
                        key={goal.id}
                        sx={{
                            position: 'absolute',
                            left: `${(goal.valor / sortedGoals[sortedGoals.length - 1].valor) * 100}%`,
                            transform: 'translateX(-50%)',
                            textAlign: 'center',
                            whiteSpace: 'normal',
                            fontWeight: goal.id === currentGoal.id ? 'bold' : 'normal',
                            fontSize: '0.75rem',
                            width: '90px', // Ajuste a largura para garantir que o texto fique dentro do box
                            lineHeight: '1.2',
                            boxSizing: 'border-box',
                            display: 'flex',
                            flexDirection: 'column', // Exibe o texto e o valor em coluna
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: goal.id === currentGoal.id ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
                        }}
                    >
                        <span>{goal.meta}</span>
                        <span style={{ fontSize: '0.6rem', color: 'grey' }}>
                            {goal.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default ProgressBar;
