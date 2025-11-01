import PatternCard from './PatternCard'

const PatternGrid = ({ patterns, onPatternClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {patterns.map((pattern) => (
        <PatternCard key={pattern.id} pattern={pattern} onClick={() => onPatternClick(pattern)} />
      ))}
    </div>
  )
}

export default PatternGrid