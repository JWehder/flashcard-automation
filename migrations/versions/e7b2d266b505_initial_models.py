"""initial models

Revision ID: e7b2d266b505
Revises: 64b488781ba6
Create Date: 2023-10-19 20:11:56.873669

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e7b2d266b505'
down_revision = '64b488781ba6'
branch_labels = None
depends_on = None


def upgrade():
    # Create 'sets' table
    op.create_table(
        'sets',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('name', sa.String),
        sa.Column('created_at', sa.DateTime),
    )
    
    # Create 'flashcards' table
    op.create_table(
        'flashcards',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('question', sa.String, nullable=False),
        sa.Column('answer', sa.String, nullable=False),
        sa.Column('set_id', sa.Integer, sa.ForeignKey('sets.id')),
    )


def downgrade():
    # Drop 'flashcards' table first because it has a ForeignKey to 'sets'
    op.drop_table('flashcards')
    
    # Drop 'sets' table
    op.drop_table('sets')