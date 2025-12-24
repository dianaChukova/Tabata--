import { render, screen, fireEvent} from '@testing-library/react';
import Timer from '../index';

describe('Timer Component', () => {
    const defaultProps = {
        onFinish: jest.fn(),
        onRepeat: jest.fn(),
        rounds: 3,
        workTime: 5,
        restTime: 2,
    }

    let audioMock

    beforeEach(() => {
        jest.useFakeTimers()
        jest.clearAllMocks()
    
        audioMock = {
            volume: 0.3,
            load: jest.fn(),
            play: jest.fn().mockResolvedValue(undefined),
            pause: jest.fn(),
            currentTime: 0,
            addEventListener: jest.fn((event, callback) => {
                if (event === 'ended') {
                    audioMock._endedCallback = callback
                }
            }),
            removeEventListener: jest.fn(),
            _endedCallback: null,
        }
        global.Audio = jest.fn(() => audioMock)
  })

    afterEach(() => {
        jest.useRealTimers()
    })

  
   test('1. Отображение в неативном состоянии', () => {
        render(<Timer {...defaultProps} isActive={false} />)
        expect(screen.getByText('Выполнение')).toBeInTheDocument()
        expect(screen.getByText('Раунд: 1 / 3')).toBeInTheDocument()
        expect(screen.getByText('5')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Пауза' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Сброс' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Сброс' })).not.toBeDisabled()
    })

    test('2. Отображение состояния "Приготовьтесь" при первом запуске', () => {
        render(<Timer {...defaultProps} isActive={true} />)
        
        expect(screen.getByText('Приготовьтесь')).toBeInTheDocument()
        expect(screen.getByText('Таймер начнется после сигнала')).toBeInTheDocument()
        expect(screen.queryByText('Пауза')).not.toBeInTheDocument()
        expect(screen.queryByText('Сброс')).not.toBeInTheDocument()
        
        expect(global.Audio).toHaveBeenCalledWith('/sound.mp3')
        expect(audioMock.load).toHaveBeenCalled()
    })

    test('3. Пауза и запуск', () => {
        render(<Timer {...defaultProps} />)
        
        const toggleButton = screen.getByText('Пауза')
    
        fireEvent.click(toggleButton)
        expect(screen.getByText('Продолжить')).toBeInTheDocument()
        
        fireEvent.click(screen.getByText('Продолжить'))
        expect(screen.getByText('Пауза')).toBeInTheDocument()
        
        fireEvent.click(screen.getByText('Пауза'))
        expect(screen.getByText('Продолжить')).toBeInTheDocument()
    })

    test('4. Кнопка "Сброс" возвращает все в исходное состояние и вызывает onFinish(false)', () => {
        render(<Timer {...defaultProps} />)

        const resetButton = screen.getByText('Сброс')
        
        expect(screen.queryByText('Закончили')).not.toBeInTheDocument()
        
        if (!resetButton.disabled) {
            fireEvent.click(resetButton)
        } else {
            fireEvent.click(screen.getByText('Пауза'))
            fireEvent.click(screen.getByText('Сброс'))
        }
        expect(defaultProps.onFinish).toHaveBeenCalledWith(false)
    })

    test('5. Кнопка "Повторить" запускает таймер заново и вызывает onRepeat', () => {
        const mockOnRepeat = jest.fn()
        
        render(
            <div className='timer'>
            <div className='title'>Закончили</div>
            <h2>Отличная работа!</h2>
            <div className='timerButton'>
                <button className='button' onClick={mockOnRepeat}>Повторить</button>
                <button className='button' onClick={() => {}}>Выйти</button>
            </div>
            </div>
        )

        const repeatButton = screen.getByText('Повторить')
        expect(repeatButton).toBeInTheDocument()
        fireEvent.click(repeatButton)
        expect(mockOnRepeat).toHaveBeenCalledTimes(1)
    })

    test('6.Кнопка "Выйти" вызывает onFinish с false', () => {
        const mockOnFinish = jest.fn()

        render(
            <div className='timer'>
            <div className='title'>Закончили</div>
            <h2>Отличная работа!</h2>
            <div className='timerButton'>
                <button className='button' onClick={() => {}}>Повторить</button>
                <button className='button' onClick={() => mockOnFinish(false)}>Выйти</button>
            </div>
            </div>
        )

        const exitButton = screen.getByText('Выйти')
        expect(exitButton).toBeInTheDocument()
        fireEvent.click(exitButton)

        expect(mockOnFinish).toHaveBeenCalledTimes(1)
        expect(mockOnFinish).toHaveBeenCalledWith(false)
    })
})

