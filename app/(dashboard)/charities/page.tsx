'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ExternalLink, Panda, Globe, TreePine, Waves, Zap, Users, Earth } from 'lucide-react'

interface Charity {
  id: string
  name: string
  description: string
  focus: string
  website: string
  impact: string
  logoUrl: string
  category: 'climate' | 'ocean' | 'forest' | 'renewable' | 'conservation' | 'education'
}

const charities: Charity[] = [
  {
    id: '1',
    name: 'World Wildlife Fund (WWF)',
    description: 'Leading conservation organization working to protect endangered species and their habitats while addressing climate change and promoting sustainable resource use.',
    focus: 'Wildlife Conservation & Climate Action',
    website: 'https://www.worldwildlife.org',
    impact: 'Protecting 1.6 billion acres of land and marine areas worldwide',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/WWF_logo.svg/1200px-WWF_logo.svg.png',
    category: 'conservation'
  },
  {
    id: '2',
    name: 'The Nature Conservancy',
    description: 'Global environmental organization dedicated to conserving lands and waters on which all life depends through science-based solutions.',
    focus: 'Land & Water Conservation',
    website: 'https://www.nature.org',
    impact: 'Protected over 125 million acres across 70+ countries',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/The_Nature_Conservancy_Logo.svg/1280px-The_Nature_Conservancy_Logo.svg.png',
    category: 'forest'
  },
  {
    id: '3',
    name: 'Ocean Conservancy',
    description: 'Working to protect the ocean from today\'s greatest global challenges through science-based solutions for a healthy ocean and wildlife.',
    focus: 'Ocean Protection & Marine Life',
    website: 'https://oceanconservancy.org',
    impact: 'Removed 350+ million pounds of trash from waterways',
    logoUrl: 'https://oceanconservancy.org/wp-content/uploads/2017/04/OC-Logo_4c_tag.png',
    category: 'ocean'
  },
  {
    id: '4',
    name: 'Solar Sister',
    description: 'Empowering women entrepreneurs in Africa to distribute clean energy solutions, creating economic opportunities while combating climate change.',
    focus: 'Clean Energy & Women\'s Empowerment',
    website: 'https://solarsister.org',
    impact: 'Trained 5,000+ women entrepreneurs across Nigeria, Tanzania, Uganda',
    logoUrl: 'https://solarsister.org/wp-content/uploads/2020/11/Solar-Sister-Logo-2020.png',
    category: 'renewable'
  },
  {
    id: '5',
    name: '350.org',
    description: 'Building a global grassroots climate movement that can hold leaders accountable to the realities of science and principles of justice.',
    focus: 'Climate Activism & Policy Change',
    website: 'https://350.org',
    impact: 'Organized 20,000+ climate actions in 188 countries',
    logoUrl: 'https://350.org/wp-content/themes/threefifty/img/350-logo.png',
    category: 'climate'
  },
  {
    id: '6',
    name: 'Rainforest Alliance',
    description: 'Working to conserve biodiversity and ensure sustainable livelihoods by transforming land-use practices, business practices, and consumer behavior.',
    focus: 'Sustainable Agriculture & Forest Protection',
    website: 'https://www.rainforest-alliance.org',
    impact: 'Certified 3.2 million farmers and 14 million hectares',
    logoUrl: 'https://www.rainforest-alliance.org/wp-content/uploads/2021/06/ra-logo-tagline-english.png',
    category: 'forest'
  },
  {
    id: '7',
    name: 'Environmental Defense Fund',
    description: 'Using science, economics, and law to create innovative solutions that make the world cleaner, healthier, and more prosperous.',
    focus: 'Policy & Market-Based Solutions',
    website: 'https://www.edf.org',
    impact: 'Helped retire 370+ old coal plants and prevented 1.8B tons CO2',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Environmental_Defense_Fund_logo.svg/1280px-Environmental_Defense_Fund_logo.svg.png',
    category: 'climate'
  },
  {
    id: '8',
    name: 'One Tree Planted',
    description: 'Environmental charity focused on global reforestation. Makes it simple for anyone to help the environment by planting trees.',
    focus: 'Reforestation & Biodiversity',
    website: 'https://onetreeplanted.org',
    impact: 'Planted over 100 million trees across 80+ countries',
    logoUrl: 'https://onetreeplanted.org/cdn/shop/files/OTP-Logo-Green_500x.png',
    category: 'forest'
  },
  {
    id: '9',
    name: 'Clean Air Task Force',
    description: 'Working to safeguard against climate change by catalyzing the rapid global development and deployment of low carbon energy and technologies.',
    focus: 'Clean Energy Innovation',
    website: 'https://www.cleanairttaskforce.org',
    impact: 'Advancing policies that saved 200,000+ lives from air pollution',
    logoUrl: 'https://www.catf.us/wp-content/uploads/2019/09/CATF_logo_tag_RGB.png',
    category: 'renewable'
  },
  {
    id: '10',
    name: 'Surfrider Foundation',
    description: 'Dedicated to the protection and enjoyment of the world\'s ocean, waves and beaches through a powerful activist network.',
    focus: 'Ocean & Beach Conservation',
    website: 'https://www.surfrider.org',
    impact: 'Protected 50+ coastlines and beaches across 12 countries',
    logoUrl: 'https://www.surfrider.org/assets/surfrider_logo-b7b1eff2c9b1b45833b85cd0b1c1bf0c4ce1e79de3f74e5b07ad3bb5c1c4c5eb.png',
    category: 'ocean'
  },
  {
    id: '11',
    name: 'Climate Reality Project',
    description: 'Training activists around the world to speak powerfully about the climate crisis and push for the bold action we need.',
    focus: 'Climate Education & Advocacy',
    website: 'https://www.climaterealityproject.org',
    impact: 'Trained 35,000+ climate leaders in 160+ countries',
    logoUrl: 'https://www.climaterealityproject.org/sites/climaterealityproject.org/files/CRP_Logo_Horizontal_FullColor_RGB.png',
    category: 'education'
  },
  {
    id: '12',
    name: 'Greenpeace',
    description: 'Independent global campaigning organization that acts to change attitudes and behavior, to protect and conserve the environment.',
    focus: 'Environmental Activism & Direct Action',
    website: 'https://www.greenpeace.org',
    impact: 'Stopped nuclear testing and protected Antarctic wilderness',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Greenpeace_logo.svg/1280px-Greenpeace_logo.svg.png',
    category: 'conservation'
  }
]

const categories = [
  { key: 'all', label: 'All Charities', icon: Globe },
  { key: 'climate', label: 'Climate Action', icon: Earth },
  { key: 'forest', label: 'Forest Protection', icon: TreePine },
  { key: 'ocean', label: 'Ocean Conservation', icon: Waves },
  { key: 'renewable', label: 'Clean Energy', icon: Zap },
  { key: 'conservation', label: 'Wildlife & Conservation', icon: Panda },
  { key: 'education', label: 'Education & Advocacy', icon: Users }
]

const EnvironmentalCharities = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [expandedCharity, setExpandedCharity] = useState<string | null>(null)

  const filteredCharities = selectedCategory === 'all' 
    ? charities 
    : charities.filter(charity => charity.category === selectedCategory)

  const handleCharityClick = (charityId: string) => {
    setExpandedCharity(expandedCharity === charityId ? null : charityId)
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      climate: 'from-blue-300 to-blue-200',
      ocean: 'from-cyan-300 to-blue-100',
      forest: 'from-green-300 to-emerald-100',
      renewable: 'from-yellow-300 to-orange-100',
      conservation: 'from-purple-300 to-pink-100',
      education: 'from-indigo-300 to-purple-100'
    }
    return colors[category as keyof typeof colors] || 'from-gray-100 to-gray-200'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🌱 Environmental Impact Partners
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover amazing organizations making a real difference for our planet. 
            Support their mission and amplify your environmental impact beyond personal actions.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category.key
                    ? 'bg-emerald-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 shadow-md'
                }`}
              >
                <IconComponent size={18} />
                {category.label}
              </button>
            )
          })}
        </div>

        {/* Charities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCharities.map((charity) => (
            <div
              key={charity.id}
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Charity Header */}
              <div className={`bg-gradient-to-r ${getCategoryColor(charity.category)} p-6 text-white`}>
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-16 h-16 bg-white rounded-lg p-2 flex items-center justify-center flex-shrink-0">
                    <Image 
                      src={charity.logoUrl} 
                      alt={`${charity.name} logo`}
                      width={48}
                      height={48}
                      className="object-contain"
                      unoptimized={true}
                      onError={(e) => {
                        // Fallback to org initials if logo fails to load
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div 
                      className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-600 font-bold text-xs text-center hidden"
                      style={{ display: 'none' }}
                    >
                      {charity.name.split(' ').map(word => word[0]).join('').slice(0, 3)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold truncate">{charity.name}</h3>
                    <p className="text-white/90 text-sm">{charity.focus}</p>
                  </div>
                </div>
              </div>

              {/* Charity Content */}
              <div className="p-6">
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {expandedCharity === charity.id ? charity.description : `${charity.description.slice(0, 120)}...`}
                </p>

                {/* Impact */}
                <div className="bg-emerald-50 rounded-lg p-3 mb-4">
                  <p className="text-sm font-medium text-emerald-800">
                    <span className="text-emerald-600">Impact:</span> {charity.impact}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleCharityClick(charity.id)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-medium transition-all duration-200 text-center min-h-[44px] flex items-center justify-center"
                  >
                    {expandedCharity === charity.id ? 'Show Less' : 'Learn More'}
                  </button>
                  <a
                    href={charity.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 min-h-[44px] min-w-[120px]"
                  >
                    <span>Visit</span>
                    <ExternalLink size={16} className="flex-shrink-0" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center bg-white rounded-2xl shadow-lg p-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Ready to Make a Bigger Impact? 🌍
          </h2>
          <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
            Your carbon tracking is just the beginning. Supporting these organizations 
            multiplies your environmental impact and helps create systemic change.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-semibold transition-colors duration-200">
              Share Your Favorite Charity
            </button>
            <button className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8 py-3 rounded-full font-semibold transition-colors duration-200">
              Suggest an Organization
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnvironmentalCharities