import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Timer from "../index"; 

jest.useFakeTimers()

describe('Timer Component (Compact)', () => {
    const defaultProps = {
        isActive: false,
        onFinish: jest.fn(),
        onRepeat: jest.fn(),
        rounds: 1, 
        workTime: 2, 
        restTime: 1, 
    }

    beforeEach(() => {
        jest.clearAllTimers()
        defaultProps.onFinish.mockClear()
        defaultProps.onRepeat.mockClear()
    })

    afterEach(() => {
        act(() => {
            jest.runOnlyPendingTimers()
        })
    })

    test('1. Отображение в неативном состоянии', () => {
        render(<Timer {...defaultProps} isActive={false} />)
        expect(screen.getByText('Выполнение')).toBeInTheDocument()
        expect(screen.getByText('Раунд: 1 / 1')).toBeInTheDocument()
        expect(screen.getByText('2')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Пауза' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Сброс' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Сброс' })).not.toBeDisabled()
    })

    test('2. Отсчет до завершения', () => {
        render(<Timer {...defaultProps} isActive={true} />)

        expect(screen.getByText('Выполнение')).toBeInTheDocument()
        expect(screen.getByText('2')).toBeInTheDocument()
        act(() => { jest.advanceTimersByTime(1000); })
        expect(screen.getByText('1')).toBeInTheDocument()

        act(() => { jest.advanceTimersByTime(1000); })
        expect(screen.getByText('Закончили')).toBeInTheDocument()
        expect(screen.getByText('Отличная работа!')).toBeInTheDocument()

        expect(defaultProps.onFinish).toHaveBeenCalledTimes(1)
        expect(defaultProps.onFinish).toHaveBeenCalledWith(true)
    })

    test('3. Пауза и запуск', () => {
        render(<Timer {...defaultProps} isActive={true} />)

        act(() => { jest.advanceTimersByTime(1000); })
        expect(screen.getByText('1')).toBeInTheDocument()

        fireEvent.click(screen.getByRole('button', { name: 'Пауза' }))
        expect(screen.getByRole('button', { name: 'Продолжить' })).toBeInTheDocument()
        act(() => { jest.advanceTimersByTime(1000); })
        expect(screen.getByText('1')).toBeInTheDocument()

        fireEvent.click(screen.getByRole('button', { name: 'Продолжить' }))
        expect(screen.getByRole('button', { name: 'Пауза' })).toBeInTheDocument()
        act(() => { jest.advanceTimersByTime(1000); })
    })

    test('4. Кнопа "Сброс" возращает все в исходное состояние и вызываеться функция onFinish(false)', () => {
        const { rerender } = render(<Timer {...defaultProps} isActive={true} />)

        act(() => { jest.advanceTimersByTime(1000); })
        expect(screen.getByText('1')).toBeInTheDocument()

        rerender(<Timer {...defaultProps} isActive={false} />)
        fireEvent.click(screen.getByRole('button', { name: 'Сброс' }))

        expect(screen.getByText('Выполнение')).toBeInTheDocument()
        expect(screen.getByText('Раунд: 1 / 1')).toBeInTheDocument()
        expect(screen.getByText('2')).toBeInTheDocument()
        expect(defaultProps.onFinish).toHaveBeenCalledWith(false)
    })

    test('5. Кнопка "Повторить" сбрасывает таймер и вызывает повторение', () => {
        render(<Timer {...defaultProps} isActive={true} />)

        act(() => { jest.advanceTimersByTime(defaultProps.workTime * 1000 + defaultProps.restTime * 1000)})
        
        expect(screen.getByText('Закончили')).toBeInTheDocument()
        expect(screen.getByText('Отличная работа!')).toBeInTheDocument()

        expect(defaultProps.onFinish).toHaveBeenCalledWith(true)
        defaultProps.onFinish.mockClear()

        fireEvent.click(screen.getByRole('button', { name: 'Повторить' }))
        expect(screen.getByText('Выполнение')).toBeInTheDocument()
        expect(screen.getByText('Раунд: 1 / 1')).toBeInTheDocument()
        expect(screen.getByText('2')).toBeInTheDocument()
        
        expect(defaultProps.onRepeat).toHaveBeenCalledTimes(1)
        expect(defaultProps.onFinish).toHaveBeenCalledWith(false)
    })
})